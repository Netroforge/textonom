import { defineStore } from 'pinia'

export const useTransformationStore = defineStore('transformation', {
  state: () => ({
    isTransforming: false,
    transformationName: '',
    transformationStartTime: null,
    transformationDuration: 0
  }),

  actions: {
    startTransformation(transformationName) {
      this.isTransforming = true
      this.transformationName = transformationName
      this.transformationStartTime = Date.now()
    },

    endTransformation() {
      this.transformationDuration = Date.now() - this.transformationStartTime
      this.isTransforming = false
      this.transformationStartTime = null

      // Reset transformation name after a short delay to allow for animation completion
      setTimeout(() => {
        this.transformationName = ''
        this.transformationDuration = 0
      }, 1000)
    },

    cancelTransformation() {
      this.isTransforming = false
      this.transformationName = ''
      this.transformationStartTime = null
      this.transformationDuration = 0
    }
  },

  getters: {
    getTransformationStatus() {
      return {
        isTransforming: this.isTransforming,
        transformationName: this.transformationName,
        transformationDuration: this.transformationDuration
      }
    }
  }
})
