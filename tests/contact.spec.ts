import { expect, test, type Page, type Route } from '@playwright/test'
import { ready } from './helpers'

// Estas pruebas simulan la respuesta de Web3Forms con page.route: comprueban lo que SALE del navegador
// (qué campos viajan) y cómo reacciona la interfaz. El envío real a Web3Forms no se puede automatizar.
// Necesitan un build con clave de formulario: VITE_WEB3FORMS_KEY=lo-que-sea npm run build
const withForm = Boolean(process.env.VITE_WEB3FORMS_KEY)

const ok = { success: true, message: 'ok' }
const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  })

/** Valor del campo `name` en el cuerpo multipart de una petición. */
function field(body: string, name: string): string | null {
  const m = body.match(new RegExp(`name="${name}"\\r?\\n\\r?\\n([\\s\\S]*?)\\r?\\n--`))
  return m ? m[1] : null
}

async function openContact(page: Page, url = '/') {
  await page.goto(url)
  await ready(page)
  await page.locator('#contacto').scrollIntoViewIfNeeded()
}

test.describe('Contacto', () => {
  test('mensaje vacío: error accesible', async ({ page }) => {
    await openContact(page)
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(page.getByRole('alert')).toContainText('Escribe un mensaje')
  })

  test('los canales de contacto apuntan a los destinos correctos', async ({ page }) => {
    await openContact(page)
    const contact = page.locator('#contacto')
    await expect(contact.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\/34684180746\?text=/)
    await expect(contact.getByRole('link', { name: '+34 684 18 07 46' })).toHaveAttribute('href', 'tel:+34684180746')
    await expect(contact.getByRole('link', { name: 'josedanielgarcialeon4@gmail.com' })).toHaveAttribute('href', 'mailto:josedanielgarcialeon4@gmail.com')
  })

  test('el aviso de privacidad del formulario enlaza al aviso legal', async ({ page }) => {
    await openContact(page)
    await page.getByText('Cómo uso tus datos').click()
    await page.getByRole('link', { name: /aviso legal y de privacidad/ }).click()
    await expect(page).toHaveURL(/\/aviso-legal\/$/)
  })

  test.describe('envío con formulario real (simulado)', () => {
    test.skip(!withForm, 'Construye con VITE_WEB3FORMS_KEY para probar el envío')

    test('email inválido: no se envía nada y avisa', async ({ page }) => {
      let sent = 0
      await page.route('https://api.web3forms.com/submit', (r) => (sent++, json(r, 200, ok)))
      await openContact(page)
      await page.getByPlaceholder('Tu email').fill('esto-no-es-un-email')
      await page.getByPlaceholder(/Cuéntame en qué consiste/).fill('Hola')
      await page.getByRole('button', { name: 'Enviar' }).click()
      await expect(page.getByRole('alert')).toContainText('email válido')
      expect(sent).toBe(0)
    })

    test('viajan todos los campos del brief y la interfaz confirma la recepción', async ({ page }) => {
      let body = ''
      await page.route('https://api.web3forms.com/submit', (r) => {
        body = r.request().postDataBuffer()?.toString('utf8') ?? ''
        return json(r, 200, ok)
      })
      await openContact(page)

      await page.getByRole('radio', { name: 'Una primera conversación' }).check()
      await page.getByRole('radio', { name: 'Web corporativa' }).check()
      await page.getByPlaceholder('Tu nombre').fill('Ana Gómez')
      await page.getByPlaceholder('Tu email').fill('ana@acme.es')
      await page.getByPlaceholder('Empresa (opcional)').fill('Acme S.L.')
      await page.getByRole('combobox', { name: 'Presupuesto (opcional)' }).selectOption({ label: 'De 1.000 a 3.000 €' })
      await page.getByPlaceholder(/Cuéntame en qué consiste/).fill('Necesito una web nueva para mi empresa.')
      await page.getByRole('button', { name: 'Enviar' }).click()

      await expect(page.locator('.bubble__state', { hasText: 'Enviado' })).toBeVisible()
      await expect(page.getByText('Recibido. Te respondo en 24 h laborables')).toBeVisible()

      expect(field(body, 'access_key')).toBe(process.env.VITE_WEB3FORMS_KEY)
      expect(field(body, 'name')).toBe('Ana Gómez')
      expect(field(body, 'email')).toBe('ana@acme.es')
      expect(field(body, 'company')).toBe('Acme S.L.')
      expect(field(body, 'intent')).toBe('Una primera conversación')
      expect(field(body, 'project_type')).toBe('Web corporativa')
      expect(field(body, 'budget')).toBe('De 1.000 a 3.000 €')
      expect(field(body, 'message')).toBe('Necesito una web nueva para mi empresa.')
      expect(field(body, 'subject')).toBe('Contacto desde la web · Una primera conversación · Web corporativa')
    })

    test('si el servicio falla, avisa y deja reintentar sin perder el mensaje', async ({ page }) => {
      let fail = true
      await page.route('https://api.web3forms.com/submit', (r) => (fail ? json(r, 500, { success: false, message: 'boom' }) : json(r, 200, ok)))
      await openContact(page)
      await page.getByPlaceholder('Tu email').fill('ana@acme.es')
      await page.getByPlaceholder(/Cuéntame en qué consiste/).fill('Mensaje de prueba')
      await page.getByRole('button', { name: 'Enviar' }).click()

      await expect(page.getByText('No se pudo enviar.')).toBeVisible()
      fail = false
      await page.getByRole('button', { name: 'Reintentar' }).click()
      await expect(page.locator('.bubble__state', { hasText: 'Enviado' })).toBeVisible()
      await expect(page.getByText('Recibido. Te respondo en 24 h laborables')).toBeVisible()
    })

    test('sin red el mensaje queda en cola y sale al volver a conectar', async ({ page }) => {
      const bodies: string[] = []
      await page.route('https://api.web3forms.com/submit', (r) => {
        bodies.push(r.request().postDataBuffer()?.toString('utf8') ?? '')
        return json(r, 200, ok)
      })
      await openContact(page, '/?offline=1')
      await expect(page.locator('html')).toHaveAttribute('data-offline', 'true')

      await page.getByPlaceholder('Tu email').fill('ana@acme.es')
      await page.getByPlaceholder(/Cuéntame en qué consiste/).fill('Mensaje escrito sin red')
      await page.getByRole('button', { name: 'Enviar' }).click()
      await expect(page.getByText('En cola. Se enviará al desactivar el modo avión.')).toBeVisible()
      expect(bodies).toHaveLength(0)

      // Sobrevive a una recarga y sale al reconectar.
      await page.reload()
      await ready(page)
      await page.getByRole('switch', { name: 'Modo avión' }).first().click()
      await expect(page.locator('html')).toHaveAttribute('data-offline', 'false')
      await expect.poll(() => bodies.length).toBe(1)
      expect(field(bodies[0], 'message')).toBe('Mensaje escrito sin red')
      await expect(page.locator('.bubble__state', { hasText: 'Enviado' })).toBeVisible()
    })

    test('el campo trampa para bots impide el envío', async ({ page }) => {
      let sent = 0
      await page.route('https://api.web3forms.com/submit', (r) => (sent++, json(r, 200, ok)))
      await openContact(page)
      await page.getByPlaceholder('Tu email').fill('ana@acme.es')
      await page.getByPlaceholder(/Cuéntame en qué consiste/).fill('Soy un bot')
      await page.locator('input[name="botcheck"]').evaluate((el: HTMLInputElement) => {
        el.value = 'spam'
      })
      await page.getByRole('button', { name: 'Enviar' }).click()
      await page.waitForTimeout(300)
      expect(sent).toBe(0)
    })
  })
})
