import { jest, test, expect, beforeAll, afterAll } from '@jest/globals';
import { Builder, By, until } from 'selenium-webdriver';

jest.setTimeout(60000); 

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('firefox').build();
});

afterAll(async () => {
  if (driver) await driver.quit();
});



async function createItinerary(title = 'Paris, France') {
  console.log('Navigating to the Create Itinerary page...');
  await driver.get('http://localhost:3000/create_itinerary');

  console.log('Filling out the itinerary form...');
  await driver.wait(until.elementLocated(By.id('startDate')), 5000);
  await driver.sleep(1000); 
  await driver.findElement(By.id('startDate')).sendKeys('2023-12-01');
  await driver.sleep(1000); 
  await driver.findElement(By.id('endDate')).sendKeys('2023-12-10');
  await driver.sleep(1000); 
  await driver.findElement(By.id('destinationInput')).sendKeys(title);
  await driver.sleep(1000); 
  await driver.findElement(By.id('add-destination-btn')).click();

  console.log('Submitting the itinerary form...');
  await driver.findElement(By.id('save-itinerary-btn')).click();

  console.log('Waiting for the "Itinerary saved successfully!" alert...');
  try {
    await driver.wait(until.alertIsPresent(), 15000); 
    const alert = await driver.switchTo().alert();
    console.log('Alert text (save itinerary):', await alert.getText());
    await driver.sleep(2000);
    await alert.accept();
  } catch (error) {
    console.error('No save itinerary alert detected:', error);
    throw new Error('Save Itinerary alert was not detected, failing the function.');
  }

  console.log('Waiting for dashboard redirection...');
  await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 10000);

  console.log('Waiting for at least one itinerary card to appear...');
  const firstItineraryCard = await driver.wait(
    until.elementLocated(By.css('.itinerary-card')),
    15000
  );

  const cardContent = await firstItineraryCard.getText();
  console.log('First itinerary card content:', cardContent);

  console.log('Itinerary successfully created and displayed.');
}


async function register() {
  console.log('Navigating to the Register page...');
  await driver.get('http://localhost:3000/register');

  console.log('Filling out the registration form...');
  await driver.findElement(By.id('username')).sendKeys('testuser123');
  await driver.sleep(500);
  await driver.findElement(By.id('email')).sendKeys('test@gmail.com');
  await driver.sleep(500);
  await driver.findElement(By.id('password')).sendKeys('password123');
  await driver.sleep(500);

  console.log('Selecting country...');
  await driver.findElement(By.id('nationalitydropdown')).click();
  const countryOption = await driver.findElement(By.xpath("//option[text()='Pakistan']"));
  await countryOption.click();
  await driver.sleep(500);

  console.log('Submitting the registration form...');
  const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create Account')]"));
  await submitButton.click();

  console.log('Waiting for the "Registration successful" alert...');
  try {
    await driver.wait(until.alertIsPresent(), 10000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    console.log('Alert text (registration):', alertText);
    expect(alertText).toContain('User registered successfully');
    await alert.accept();

    console.log('Alert handled successfully.');
  } catch (error) {
    console.error('No registration alert detected. Checking page source...');
    const pageSource = await driver.getPageSource();
    console.log('Current page source:', pageSource); 
    throw new Error('Registration failed due to alert handling issues.');
  }

  await driver.sleep(2000);
  console.log('Registration completed successfully.');
}

async function login() {
  console.log('Navigating to the Login page...');
  await driver.get('http://localhost:3000/login');
  await driver.findElement(By.id('username')).sendKeys('testuser123');
  await driver.sleep(500);
  await driver.findElement(By.id('password')).sendKeys('password123');
  await driver.sleep(500);
  await driver.findElement(By.css('.login-button')).click();

  try {
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    console.log('Alert text (login):', await alert.getText());
    await alert.accept();
  } catch (error) {
    console.error('No login alert detected:', error);
  }

  await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 10000);
  console.log('Login completed successfully.');
}


test('Functional Workflow: Register, Login, Create, View, Delete, Profile, Logout', async () => {
  console.log('Registering a new user...');
  await register();

  console.log('Logging in...');
  await login();

  console.log('Creating an itinerary...');
  await createItinerary();

  console.log('Viewing an itinerary...');
  const firstCard = await driver.wait(
    until.elementLocated(By.css('.itinerary-card')),
    10000
  );
  await driver.sleep(2000);
  const viewButton = await firstCard.findElement(By.xpath(".//button[text()='View']"));
  await viewButton.click();
  await driver.sleep(2000);

  const modal = await driver.wait(until.elementLocated(By.id('itinerary-modal')), 10000);
  expect(await modal.isDisplayed()).toBe(true);

  const modalBody = await modal.findElement(By.id('modal-body'));
  const modalText = await modalBody.getText();
  console.log('Modal content:', modalText);
  expect(modalText).toContain('Start Date');
  expect(modalText).toContain('End Date');

  await driver.sleep(1000);

  const closeButton = await modal.findElement(By.css('.close'));
  await closeButton.click();
  await driver.sleep(1000);

  await driver.wait(async () => {
    const isDisplayed = await modal.isDisplayed().catch(() => false);
    return !isDisplayed;
  }, 5000);

  console.log('Deleting an itinerary...');
  const deleteButtons = await driver.findElements(By.xpath("//button[text()='Delete']"));
  expect(deleteButtons.length).toBeGreaterThan(0);
  console.log(`Number of itineraries before deletion: ${deleteButtons.length}`);

  await driver.sleep(2000);
  await deleteButtons[0].click();

  try {
    console.log('Waiting for delete confirmation alert...');
    await driver.wait(until.alertIsPresent(), 5000);
    const confirmationAlert = await driver.switchTo().alert();
    console.log('Alert text (delete confirmation):', await confirmationAlert.getText());
    await confirmationAlert.accept();

    console.log('Waiting for success alert...');
    await driver.wait(until.alertIsPresent(), 5000);
    const successAlert = await driver.switchTo().alert();
    console.log('Alert text (success):', await successAlert.getText());
    await driver.sleep(1000);
    await successAlert.accept();
  } catch (error) {
    console.error('Error handling alerts:', error);
    throw error;
  }
  
  const remainingItineraries = await driver.findElements(By.css('.itinerary-card'));
  console.log(`Number of itineraries after deletion: ${remainingItineraries.length}`);
  expect(remainingItineraries.length).toBeLessThan(deleteButtons.length);
  await driver.sleep(1000);
  console.log('Navigating to Profile page...');
  const profileLink = await driver.findElement(By.xpath("//a[contains(text(), 'Profile')]"));
  await profileLink.click();
  await driver.sleep(1500);

  console.log('Verifying profile information...');
  const usernameElement = await driver.wait(until.elementLocated(By.id('username')), 5000);
  const nationalityElement = await driver.findElement(By.id('nationality'));

  const usernameText = await usernameElement.getText();
  const nationalityText = await nationalityElement.getText();

  console.log('Profile username:', usernameText);
  console.log('Profile nationality:', nationalityText);

  expect(usernameText).toBe('testuser123');
  expect(nationalityText).toBe('PK');

  await driver.sleep(1500);
  console.log('Logging out...');
  await driver.findElement(By.linkText('Logout')).click();
  await driver.wait(until.urlIs('http://localhost:3000/index.html'), 10000);
  expect(await driver.getCurrentUrl()).toBe('http://localhost:3000/index.html');
  await driver.sleep(1000);
});
