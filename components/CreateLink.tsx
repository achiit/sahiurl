import { User } from "firebase/auth"

const { user } = useAuth() // Ensure this returns Firebase User type
const token = await user?.getIdToken() 