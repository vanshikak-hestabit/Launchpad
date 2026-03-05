"use client"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SignupForm() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignup = async (e) => {
  e.preventDefault()
  setMessage("")
  setIsSuccess(false)

  if (password !== confirmPassword) {
    setMessage("Passwords do not match")
    return
  }

  if (password.length < 6) {
    setMessage("Password must be at least 6 characters")
    return
  }

  setLoading(true)

  // Sign up user in Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName, phone } },
  })

  if (signUpError) {
    setMessage(signUpError.message)
    setLoading(false)
    return
  }

  const userId = signUpData.user.id

  setLoading(false)
  setIsSuccess(true)
  setMessage("Account created! Redirecting to login...")

  setTimeout(() => {
    router.push("/login")
  }, 1500)
}

  return (
    <Card className="w-full max-w-md border-border/50 shadow-lg shadow-primary/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details below to get started
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName" className="text-foreground">
              Display Name
            </Label>
            <Input
              id="displayName"
              placeholder="Your name"
              className="h-11 bg-background border-border/70 focus-visible:ring-primary/30"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone
            </Label>
            <Input
              id="phone"
              placeholder="Phone number"
              className="h-11 bg-background border-border/70 focus-visible:ring-primary/30"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-11 bg-background border-border/70 focus-visible:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10 h-11 bg-background border-border/70 focus-visible:ring-primary/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10 h-11 bg-background border-border/70 focus-visible:ring-primary/30"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
              role="alert"
            >
              {isSuccess && <CheckCircle2 className="h-4 w-4 shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full mt-1 font-medium text-primary-foreground"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Login
          </a>
        </p>
      </CardFooter>
    </Card>   
  )
  
}
