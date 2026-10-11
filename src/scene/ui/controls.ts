import { ref } from 'vue'

/** What the sections can ask of the 3D scene. */
export interface SceneControls {
  runPipeline(): void
  showBefore(on: boolean): void
  /** Returns `false` if the text produced no shape. */
  shapeText(text: string): Promise<boolean>
}

const idle: SceneControls = {
  runPipeline() {},
  showBefore() {},
  shapeText: async () => false,
}

let current = idle

/** `true` when WebGL is available and the scene is drawing. */
export const sceneReady = ref(false)

/** The scene registers itself on mount; returns the function to unregister. */
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
