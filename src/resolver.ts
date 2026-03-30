const COMPONENTS = ['ModalCollector', 'ModalOverlay']

export interface VueModalResolverOptions {
  exclude?: string[];
}

export function VueModalResolver(options: VueModalResolverOptions = {}) {
  const { exclude = [] } = options

  return {
    type: 'component' as const,
    resolve: (name: string) => {
      if (exclude.includes(name)) return
      if (COMPONENTS.includes(name))
        return { name, from: '@dsplce-co/vue-modal' }
    },
  }
}

export const VueModalPreset = {
  '@dsplce-co/vue-modal': ['useModal'],
}
