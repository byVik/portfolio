import { ref } from 'vue'

/** Lo que las secciones pueden pedirle a la escena 3D. */
export interface SceneControls {
  runPipeline(): void
  showBefore(on: boolean): void
  /** Devuelve `false` si el texto no produjo ninguna forma. */
  shapeText(text: string): Promise<boolean>
}

const idle: SceneControls = {
  runPipeline() {},
  showBefore() {},
  shapeText: async () => false,
}

let current = idle

/** `true` cuando hay WebGL y la escena está dibujando. */
export const sceneReady = ref(false)

/** La escena se registra al montarse; devuelve la función para darse de baja. */
export function registerSceneControls(controls: SceneControls): () => void {
  current = controls
  sceneReady.value = true
  return () => {
    if (current !== controls) return
    current = idle
    sceneReady.value = false
  }
}

export function useSceneControls(): SceneControls {
  return {
    runPipeline: () => current.runPipeline(),
    showBefore: (on) => current.showBefore(on),
    shapeText: (text) => current.shapeText(text),
  }
}
