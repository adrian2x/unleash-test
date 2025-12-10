import { test, expect } from '@playwright/test'

test('happy path: user searches and sees results', async ({ page }) => {
  // Intercept API request and mock it
  await page.route('/api/search/Ale', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          postNumber: 175,
          city: 'OSLO',
          street: 'Alexander Kiellands plass',
          typeCode: 6,
          type: 'Gate-/veg-adresse',
          district: 'Grünerløkka',
          municipalityNumber: 301,
          municipality: 'Oslo',
          county: 'Oslo'
        },
        {
          postNumber: 501,
          city: 'OSLO',
          street: 'Rodeløkka Postboks 6500-6599',
          typeCode: 4,
          type: 'Postboksadresse',
          district: 'Grünerløkka',
          municipalityNumber: 301,
          municipality: 'Oslo',
          county: 'Oslo'
        }
      ])
    })
  })

  // Go to the page
  await page.goto('/')

  // Type into the search input
  const input = page.getByPlaceholder('Enter address...')
  await input.fill('Ale')

  // Wait for results to appear
  await expect(page.getByText('Alexander Kiellands plass 175 OSLO')).toBeVisible()

  await page.getByText('Alexander Kiellands plass 175 OSLO').click()
  await expect(input).toHaveValue('Alexander Kiellands plass 175 OSLO')
})
