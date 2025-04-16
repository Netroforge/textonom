const { expect } = require('chai');
const sinon = require('sinon');

// Mock the window object
global.window = {
  dispatchEvent: sinon.spy(),
  applyEditorTransformation: sinon.stub().returns(true),
  electron: {
    ipcRenderer: {
      invoke: sinon.stub().resolves(true)
    }
  }
};

// Mock the logger to avoid console output during tests
jest.mock('../../src/utils/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarning: jest.fn()
}));

// Import the store after mocking
const useTransformationStore = require('../../src/stores/transformationStore').default;

describe('Transformation Store', () => {
  let store;
  
  beforeEach(() => {
    // Reset all spies and stubs
    sinon.reset();
    
    // Get a fresh instance of the store
    store = useTransformationStore.getState();
    
    // Set up initial state
    store.setActiveTabContent('test content');
    store.setActiveTabIndex(0);
  });
  
  describe('setActiveTabContent', () => {
    it('should set the active tab content', () => {
      store.setActiveTabContent('new content');
      expect(useTransformationStore.getState().activeTabContent).to.equal('new content');
    });
    
    it('should handle null or undefined by setting empty string', () => {
      store.setActiveTabContent(null);
      expect(useTransformationStore.getState().activeTabContent).to.equal('');
      
      store.setActiveTabContent(undefined);
      expect(useTransformationStore.getState().activeTabContent).to.equal('');
    });
  });
  
  describe('setActiveTabIndex', () => {
    it('should set the active tab index', () => {
      store.setActiveTabIndex(2);
      expect(useTransformationStore.getState().activeTabIndex).to.equal(2);
    });
  });
  
  describe('applyTransformation', () => {
    it('should apply a transformation and update the editor', () => {
      const result = store.applyTransformation('base64-encode');
      
      // Should return true for successful transformation
      expect(result).to.be.true;
      
      // Should call applyEditorTransformation
      expect(window.applyEditorTransformation.called).to.be.true;
      
      // Should dispatch tab-modified event
      expect(window.dispatchEvent.called).to.be.true;
      const event = window.dispatchEvent.firstCall.args[0];
      expect(event.type).to.equal('tab-modified');
      expect(event.detail.tabIndex).to.equal(0);
    });
    
    it('should return false if no active tab content', () => {
      store.setActiveTabContent('');
      const result = store.applyTransformation('base64-encode');
      expect(result).to.be.false;
    });
    
    it('should handle errors during transformation', () => {
      // Make applyEditorTransformation fail
      window.applyEditorTransformation.returns(false);
      
      const result = store.applyTransformation('invalid-transformation');
      expect(result).to.be.false;
    });
  });
});
