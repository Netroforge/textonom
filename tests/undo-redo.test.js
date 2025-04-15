// Tests for undo/redo functionality
const { app, BrowserWindow } = require('electron');
const { expect } = require('chai');
const { _electron: electron } = require('playwright');
const path = require('path');

describe('Undo/Redo Functionality', function() {
  this.timeout(10000);
  
  let electronApp;
  let window;
  
  before(async () => {
    // Launch the Electron app
    electronApp = await electron.launch({
      args: [path.join(__dirname, '..')],
      env: {
        NODE_ENV: 'test'
      }
    });
    
    // Get the first window
    window = await electronApp.firstWindow();
    
    // Wait for the app to be ready
    await window.waitForLoadState('domcontentloaded');
  });
  
  after(async () => {
    // Close the app
    await electronApp.close();
  });
  
  it('should undo text changes', async () => {
    // Type some text
    await window.click('.monaco-editor');
    await window.keyboard.type('Hello, world!');
    
    // Verify text was entered
    const textContent = await window.evaluate(() => {
      return document.querySelector('.monaco-editor').textContent;
    });
    expect(textContent).to.include('Hello, world!');
    
    // Trigger undo
    await window.keyboard.press('Control+z');
    
    // Verify text was undone
    const undoneContent = await window.evaluate(() => {
      return document.querySelector('.monaco-editor').textContent;
    });
    expect(undoneContent).not.to.include('Hello, world!');
  });
  
  it('should redo undone changes', async () => {
    // Type some text
    await window.click('.monaco-editor');
    await window.keyboard.type('Testing redo');
    
    // Undo the text
    await window.keyboard.press('Control+z');
    
    // Redo the text
    await window.keyboard.press('Control+Shift+z');
    
    // Verify text was redone
    const redoneContent = await window.evaluate(() => {
      return document.querySelector('.monaco-editor').textContent;
    });
    expect(redoneContent).to.include('Testing redo');
  });
  
  it('should preserve undo history after transformations', async () => {
    // Type some text
    await window.click('.monaco-editor');
    await window.keyboard.type('transform this text');
    
    // Apply a transformation (uppercase)
    await window.click('text=Transformations');
    await window.click('text=Case');
    await window.click('text=UPPERCASE');
    
    // Verify text was transformed
    const transformedContent = await window.evaluate(() => {
      return document.querySelector('.monaco-editor').textContent;
    });
    expect(transformedContent).to.include('TRANSFORM THIS TEXT');
    
    // Undo the transformation
    await window.keyboard.press('Control+z');
    
    // Verify text was undone
    const undoneContent = await window.evaluate(() => {
      return document.querySelector('.monaco-editor').textContent;
    });
    expect(undoneContent).to.include('transform this text');
    
    // Redo the transformation
    await window.keyboard.press('Control+Shift+z');
    
    // Verify text was redone
    const redoneContent = await window.evaluate(() => {
      return document.querySelector('.monaco-editor').textContent;
    });
    expect(redoneContent).to.include('TRANSFORM THIS TEXT');
  });
});
