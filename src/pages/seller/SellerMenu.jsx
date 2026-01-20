// import { useState } from "react";
// import api from "../../api/axios";

// export default function SellerMenu() {
//   const [items, setItems] = useState([
//     { name: "", description: "", price: "" },
//   ]);
//   const [message, setMessage] = useState("");

//   const addItem = () => {
//     setItems([...items, { name: "", description: "", price: "" }]);
//   };

//   const handleChange = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] = value;
//     setItems(updated);
//   };

//   const saveMenu = async () => {
//     try {
//       await api.post("/seller/menu/", {
//         date: new Date().toISOString().slice(0, 10),
//         items,
//       });
//       setMessage("Menu saved successfully");
//     } catch {
//       setMessage("Failed to save menu");
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Today's Menu</h2>

//       {items.map((item, i) => (
//         <div key={i} className="mb-4 border p-3 rounded">
//           <input
//             placeholder="Food name"
//             value={item.name}
//             onChange={(e) => handleChange(i, "name", e.target.value)}
//             className="w-full border p-2 mb-2"
//           />
//           <input
//             placeholder="Description"
//             value={item.description}
//             onChange={(e) =>
//               handleChange(i, "description", e.target.value)
//             }
//             className="w-full border p-2 mb-2"
//           />
//           <input
//             placeholder="Price"
//             value={item.price}
//             onChange={(e) => handleChange(i, "price", e.target.value)}
//             className="w-full border p-2"
//           />
//         </div>
//       ))}

//       <button
//         onClick={addItem}
//         className="text-blue-600 text-sm mb-3"
//       >
//         + Add item
//       </button>

//       <button
//         onClick={saveMenu}
//         className="w-full bg-black text-white py-2 rounded"
//       >
//         Save Menu
//       </button>

//       {message && <p className="mt-3">{message}</p>}
//     </div>
//   );
// }


// // import { useEffect, useState } from "react";
// // import api from "../../api/axios";

// // export default function SellerMenu() {
// //   const [menu, setMenu] = useState(null);
// //   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     const fetchMenu = async () => {
// //       try {
// //         const res = await api.get("/seller/menu/");
// //         if (res.data.items?.length) {
// //           setMenu(res.data);
// //         } else {
// //           setMessage("No menu added for today");
// //         }
// //       } catch {
// //         setMessage("Failed to load menu");
// //       }
// //     };
// //     fetchMenu();
// //   }, []);

// //   return (
// //     <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
// //       <h2 className="text-xl font-bold mb-4">📋 Today’s Menu</h2>

// //       {message && <p>{message}</p>}

// //       {menu &&
// //         menu.items.map((item) => (
// //           <div key={item.id} className="border p-3 mb-2 rounded">
// //             <h3 className="font-semibold">{item.name}</h3>
// //             <p>{item.description}</p>
// //             <p className="font-bold">₹{item.price}</p>
// //           </div>
// //         ))}
// //     </div>
// //   );
// // }

import React from "react";

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerMenu() {
  const [menu, setMenu] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/seller/menu/");
        if (res.data.items?.length) {
          setMenu(res.data);
        } else {
          setMessage("No menu added for today");
        }
      } catch {
        setMessage("Failed to load menu");
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">📋 Today’s Menu</h2>

      {message && <p>{message}</p>}

      {menu &&
        menu.items.map((item) => (
          <div key={item.id} className="border p-3 mb-2 rounded">
            <h3 className="font-semibold">{item.name}</h3>
            <p>{item.description}</p>
            <p className="font-bold">₹{item.price}</p>
          </div>
        ))}
    </div>
  );
}
