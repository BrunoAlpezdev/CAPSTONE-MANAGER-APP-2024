/** @type {import('next').NextConfig} */
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
			process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			'firebasestorage.googleapis.com',
			'*'
		]
	}
}

export default nextConfig
