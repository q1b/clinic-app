import {
  type AppleDeviceName,
  type AppleDeviceSize,
  appleSplashScreenSizes,
  defineConfig,
  minimalPreset,
  AppleSplashScreenName,
  AppleSplashScreens,
} from '@vite-pwa/assets-generator/config'
import { ResizeOptions } from 'sharp'

const devices: AppleDeviceName[] = ['iPad Pro 12.9"',"iPad Pro 11\""]

function createCustomAppleSplashScreens(
  options: {
    padding?: number
    resizeOptions?: ResizeOptions
    darkResizeOptions?: ResizeOptions
    linkMediaOptions?: AppleSplashScreenName
    name?: AppleSplashScreenName
  } = {}
) {
  const {
    padding,
    resizeOptions,
    darkResizeOptions,
    linkMediaOptions,
    name,
  } = options

  return <AppleSplashScreens>{
    sizes: devices.map((deviceName) => {
      const size = appleSplashScreenSizes[deviceName]
      if (deviceName === 'iPhone 6') {
        return <AppleDeviceSize>{
          size: { ...size, padding: 0.4 },
          darkResizeOptions: { background: '#2f2f2f' },
          name: (landscape, size, dark) => `iphone6-${landscape ? 'landscape' : 'portrait'}${dark ? '-dark' : ''}.png`,
          height: size.height,
          width: size.width,
          scaleFactor: size.scaleFactor
        }
      }

      return size
    }),
    padding,
    resizeOptions,
    darkResizeOptions,
    linkMediaOptions,
    name,
  }
}

export default defineConfig({

  preset: {
    ...minimalPreset,
    // appleSplashScreens: createCustomAppleSplashScreens({
    //   padding: 0.5,
    //   darkResizeOptions: { background: '#1f1f1f' },
    // })
  },
  images: ['static/assets/logo.svg'],
})