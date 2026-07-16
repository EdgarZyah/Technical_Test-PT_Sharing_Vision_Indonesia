"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Coins } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError("");
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-white mb-4 shadow-lg shadow-amber-500/30"
          >
            <Coins size={32} />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HaloGold</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Investasi Emas Digital Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Masuk</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Silakan masuk ke akun Anda
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="contoh@email.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
            >
              Masuk
            </Button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-xl dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2 font-medium">
              Akun Demo:
            </p>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium">Email:</span> budi@halogold.com
              </p>
              <p>
                <span className="font-medium">Password:</span> password123
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
