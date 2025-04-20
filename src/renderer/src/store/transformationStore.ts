import { defineStore } from 'pinia'

interface TransformationState {
  isTransforming: boolean
  transformationName: string
  transformationStartTime: number | null
  transformationDuration: number
}

interface TransformationStatus {
  isTransforming: boolean
  transformationName: string
  transformationDuration: number
}

export const useTransformationStore = defineStore('transformation', {
  state: (): TransformationState => ({
    isTransforming: false,
    transformationName: '',
    transformationStartTime: null,
    transformationDuration: 0
  }),

  actions: {
    startTransformation(transformationName: string): void {
      this.isTransforming = true
      this.transformationName = transformationName
      this.transformationStartTime = Date.now()
    },

    endTransformation(): void {
      if (this.transformationStartTime !== null) {
        this.transformationDuration = Date.now() - this.transformationStartTime
      }
      this.isTransforming = false
      this.transformationStartTime = null

      // Reset transformation name after a short delay to allow for animation completion
      setTimeout(() => {
        this.transformationName = ''
        this.transformationDuration = 0
      }, 1000)
    },

    cancelTransformation(): void {
      this.isTransforming = false
      this.transformationName = ''
      this.transformationStartTime = null
      this.transformationDuration = 0
    }
  },

  getters: {
    getTransformationStatus(): TransformationStatus {
      return {
        isTransforming: this.isTransforming,
        transformationName: this.transformationName,
        transformationDuration: this.transformationDuration
      }
    }
  }
})
