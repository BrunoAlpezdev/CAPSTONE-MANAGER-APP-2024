/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		domains: ['loremflickr.com']
	}
}

export default nextConfig
