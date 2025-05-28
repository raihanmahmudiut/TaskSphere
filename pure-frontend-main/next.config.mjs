import { featureFlag } from './src/lib/feature-flag/index.js';

/** @type {import('next').NextConfig} */
const images = {
  //unoptimized: true
  loader: 'custom',
  loaderFile: './src/common/loaders/image.loaders.ts',
};

const eslint = {
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  ignoreDuringBuilds: true,
};

const webpackConfig = (config, options) => {
  config.plugins.push(new options.webpack.DefinePlugin(featureFlag));
  
  // Add font file handling
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'static/fonts/[name][ext]'
    }
  });

  return config;
}

const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone',
  output: 'export',
  trailingSlash: true,
  //skipTrailingSlashRedirect: true,
  images,
  eslint,
  webpack: webpackConfig
};

export default nextConfig;
