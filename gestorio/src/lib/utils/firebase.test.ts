export const getServerSideProps = () => {
	console.log(process.env.API_KEY + ' from firebase.test.ts')

	return {
		props: {
			key: process.env.API_KEY
		}
	}
}
