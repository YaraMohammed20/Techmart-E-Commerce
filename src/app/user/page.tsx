"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  getUserProfile,
  getUserAddresses,
  addAddress as apiAddAddress,
  removeAddress as apiRemoveAddress,
} from "@/lib/api";
import {Address} from "@/interfaces/user";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email?: string; phone?: string } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({ name: "", details: "", phone: "", city: "" });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please log in.");
      setLoading(false);
      return;
    }

    getUserProfile(token)
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Failed to load profile"));

    getUserAddresses(token)
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error("Failed to load addresses"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddAddress = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      setLoading(true);
      await apiAddAddress(token, newAddress);
      toast.success("Address added!");
      setNewAddress({ name: "", details: "", phone: "", city: "" });
      const updated = await getUserAddresses(token);
      setAddresses(updated.data || []);
    } catch {
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      setLoading(true);
      await apiRemoveAddress(token, id);
      toast.success("Address removed!");
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch {
      toast.error("Failed to remove address");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10">No user data found.</p>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="p-6 border rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
      </div>

      <div className="p-6 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Saved Addresses</h2>

        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <div key={addr._id} className="mb-2 p-2 border rounded flex justify-between items-center">
              <div>
                <p>{addr.details}, {addr.city}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleRemoveAddress(addr._id)}>Delete</Button>
            </div>
          ))
        ) : (
          <p>No saved addresses.</p>
        )}

        <Separator className="my-4" />
        <h3 className="text-md font-semibold mb-2">Add New Address</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Details"
            value={newAddress.details}
            onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <Button className="w-full mt-2" onClick={handleAddAddress}>Add Address</Button>
        </div>
      </div>
    </div>
  );
}

