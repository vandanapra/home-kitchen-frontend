import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddressModal({ onConfirm, onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: track edit mode
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    address: "",
    city: "",
    pincode: "",
    is_default: false,
  });

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/auth/addresses/");
      setAddresses(res.data || []);

      const defaultAddr = res.data?.find((a) => a.is_default);
      if (defaultAddr) setSelected(defaultAddr);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= SAVE (ADD / EDIT) ================= */
  const saveAddress = async () => {
    if (!form.address || !form.city || !form.pincode) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);
    try {
      let res;

      if (editingId) {
        // ✏️ UPDATE
        res = await api.put(
          `/auth/addresses/${editingId}/`,
          form
        );
        toast.success("Address updated");
      } else {
        // ➕ CREATE
        res = await api.post("/auth/addresses/", form);
        toast.success("Address saved");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({
        address: "",
        city: "",
        pincode: "",
        is_default: false,
      });

      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      address: addr.address,
      city: addr.city,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (addrId) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await api.delete(`/auth/addresses/${addrId}/`);
      toast.success("Address deleted");

      if (selected?.id === addrId) {
        setSelected(null);
      }

      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  /* ================= SET DEFAULT ================= */
  const setDefault = async (addr) => {
    try {
      await api.post(`/auth/addresses/default/${addr.id}/`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch {
      toast.error("Failed to update default address");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          📍 Select Delivery Address
        </h2>

        {/* ================= ADDRESS LIST ================= */}
        {!showForm && (
          <>
            {addresses.length === 0 && (
              <p className="text-gray-500 mb-3">
                No saved address found
              </p>
            )}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelected(addr)}
                className={`border rounded-lg p-4 mb-3 cursor-pointer transition
                  ${
                    selected?.id === addr.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  }
                `}
              >
                <p className="font-semibold">{addr.address}</p>
                <p className="text-sm text-gray-600">
                  {addr.city} - {addr.pincode}
                </p>

                <div className="flex justify-between items-center mt-2">
                  {addr.is_default && (
                    <span className="text-green-600 text-xs font-semibold">
                      DEFAULT
                    </span>
                  )}

                  <div className="flex gap-3">
                    {!addr.is_default && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDefault(addr);
                        }}
                        className="text-xs text-blue-600 underline"
                      >
                        Set default
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(addr);
                      }}
                      className="text-xs text-indigo-600 underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                      className="text-xs text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setForm({
                    address: "",
                    city: "",
                    pincode: "",
                    is_default: false,
                  });
                }}
                className="flex-1 border border-gray-400 py-2 rounded"
              >
                + Add New Address
              </button>

              <button
                disabled={!selected}
                onClick={() => onConfirm(selected)}
                className={`flex-1 py-2 rounded text-white
                  ${
                    selected
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Deliver Here
              </button>
            </div>
          </>
        )}

        {/* ================= ADD / EDIT FORM ================= */}
        {showForm && (
          <>
            <div className="space-y-3">
              <textarea
                name="address"
                placeholder="Full address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                />
                Set as default address
              </label>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveAddress}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Address"
                  : "Save Address"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
