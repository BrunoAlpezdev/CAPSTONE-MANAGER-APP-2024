/** @type {import('next').NextConfig} */

import withPWA from 'next-pwa'

const withPWAConfig = withPWA({
	dest: 'public'
})

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		domains: [
			'loremflickr.com',
			'via.placeholder.com',
			'placehold.co',
			'placehold.com',
			'sb-assets.sgp1.cdn.digitaloceanspaces.com',
			'firebasestorage.googleapis.com',
			'*'
		]
	}
}

export default withPWAConfig(nextConfig)
