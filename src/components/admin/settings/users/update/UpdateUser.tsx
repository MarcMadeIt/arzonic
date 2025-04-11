import React, { useState, useEffect } from "react";
import { FaEnvelope, FaKey, FaShield, FaSignature } from "react-icons/fa6";
import { updateUser, getAllUsers } from "@/lib/server/actions";

const UpdateUser = ({
  userId,
  onUserUpdated,
}: {
  userId: string;
  onUserUpdated: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getAllUsers();
        const user = users.find((user) => user.id === userId);
        if (user) {
          setEmail(user.email || "");
          setRole(user.role as "editor" | "admin");
          setName(user.name || "");
        }
      } catch {
        console.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [userId]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const errors = { email: "", password: "", confirmPassword: "" };

    if (email && !validateEmail(email)) {
      errors.email = "Mailen er ugyldig";
      valid = false;
    }

    if (password && password.length < 6) {
      errors.password = "Kodeordet skal være mindst 6 tegn";
      valid = false;
    }

    if (password && password !== confirmPassword) {
      errors.confirmPassword = "Kodeordene er ikke ens";
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      setLoading(true);
      try {
        const updateData: {
          email?: string;
          password?: string;
          role?: string;
          name?: string;
        } = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (role) updateData.role = role;
        if (name) updateData.name = name;

        await updateUser(userId, updateData); // Use updateUser function
        onUserUpdated(); // Call onUserUpdated after successful update
      } catch {
        setErrors({ ...errors, password: "Fejl ved opdatering, prøv igen" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleUpdate}
        className=" flex flex-col items-start  gap-5 w-72 p-3"
      >
        <span className="text-lg font-bold">Opdater bruger</span>
        <div className="flex gap-2 relative">
          <select
            className="select select-bordered w-full"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "editor" | "admin")}
          >
            <option disabled value="">
              Hvilken adgang?
            </option>
            <option value="editor">Redaktør</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="name"
            className="input input-bordered flex items-center gap-2"
          >
            <FaSignature />
            <input
              id="name"
              autoComplete="name"
              name="name"
              type="text"
              className="grow"
              placeholder="Navn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="email"
            className="input input-bordered flex items-center gap-2"
          >
            <FaEnvelope />
            <input
              name="email"
              autoComplete="email"
              id="email"
              type="text"
              className="grow"
              placeholder="Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {errors.email && (
            <span className=" absolute -bottom-4 text-xs text-red-500">
              {errors.email}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="password"
            className="input input-bordered flex items-center gap-2"
          >
            <FaKey />
            <input
              id="password"
              name="password"
              autoComplete="new-password"
              type="password"
              className="grow"
              placeholder="Kodeord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {errors.password && (
            <span className="text-xs absolute -bottom-4 text-red-500">
              {errors.password}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="confirmPassword"
            className="input input-bordered flex items-center gap-2"
          >
            <FaShield />
            <input
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              type="password"
              className="grow"
              placeholder="Gentag kodeord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {errors.confirmPassword && (
            <span className="text-xs absolute -bottom-4 text-red-500">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Opdaterer" : "Opdater bruger"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
