import { Object3DNode, MaterialNode } from '@react-three/fiber'
import { ShaderMaterial } from 'three'

declare module '@react-three/fiber' {
    interface ThreeElements {
        ditherMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial> & {
            uColor?: any
            uLightPos?: any
            uResolution?: any
            uTime?: number
            ref?: any
        }
    }
}
