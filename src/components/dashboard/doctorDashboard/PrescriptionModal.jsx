import algoliasearch from "algoliasearch";
import { useState } from "react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
} from "react-instantsearch-hooks-web";

const searchClient = algoliasearch(
  "QK9KVRTNH4",
  "655183af5b1e02d3ea9630b9196371df"
);

const PrescriptionModal = ({
  showModal,
  closeModal,
  handleCreatePrescription,
  appointmentId,
}) => {
  const [formData, setFormData] = useState({
    symptoms: [""],
    examinations: [""],
    medicines: [
      { name: "", dosage: "", duration: "", searchVisible: false }, // Initialize with correct object structure
    ],
    notes: "",
  });

  const handleArrayChange = (e, index, key) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedArray = [...prevData[key]];
      updatedArray[index] = value;
      return { ...prevData, [key]: updatedArray };
    });
  };

  const addArrayField = (key) =>
    setFormData((prevData) => ({
      ...prevData,
      [key]: [
        ...prevData[key],
        key === "medicines"
          ? { name: "", dosage: "", duration: "", searchVisible: false } // Ensure correct structure for medicines
          : "", // Default empty string for other fields
      ],
    }));

  const removeArrayField = (key, index) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData[key]];
      updatedArray.splice(index, 1);
      return { ...prevData, [key]: updatedArray };
    });
  };

  const handleMedicineChange = (e, index, field) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedMedicines = [...prevData.medicines];
      updatedMedicines[index][field] = value;
      return { ...prevData, medicines: updatedMedicines };
    });
  };

  const handleMedicineSelect = (index, medicine) => {
    setFormData((prevData) => {
      const updatedMedicines = [...prevData.medicines];
      updatedMedicines[index].name = medicine.name;
      updatedMedicines[index].searchVisible = false;
      return { ...prevData, medicines: updatedMedicines };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreatePrescription(appointmentId, formData);
  };

  return (
    <div
      className={`${
        showModal ? "block" : "hidden"
      } fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
          Create Prescription
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Symptoms</h3>
            {formData.symptoms.map((symptom, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Symptom"
                  value={symptom}
                  onChange={(e) => handleArrayChange(e, index, "symptoms")}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("symptoms", index)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("symptoms")}
              className="text-blue-500"
            >
              + Add Symptom
            </button>

            <h3 className="text-lg font-semibold">Examinations</h3>
            {formData.examinations.map((exam, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Examination"
                  value={exam}
                  onChange={(e) => handleArrayChange(e, index, "examinations")}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("examinations", index)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("examinations")}
              className="text-blue-500"
            >
              + Add Examination
            </button>

            <h3 className="text-lg font-semibold">Medicines</h3>
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={medicine.name}
                  onChange={(e) => handleMedicineChange(e, index, "name")}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => {
                      const updatedMedicines = [...prevData.medicines];
                      updatedMedicines[index].searchVisible =
                        !updatedMedicines[index].searchVisible;
                      return { ...prevData, medicines: updatedMedicines };
                    })
                  }
                  className="text-blue-500"
                >
                  {medicine.searchVisible ? "Hide Search" : "Search Medicine"}
                </button>
                {medicine.searchVisible && (
                  <InstantSearch
                    searchClient={searchClient}
                    indexName="medicines"
                  >
                    <SearchBox
                      translations={{ placeholder: "Search for a medicine..." }}
                      className="w-full p-2 border rounded-md"
                    />
                    <Configure hitsPerPage={5} />
                    <Hits
                      hitComponent={({ hit }) => (
                        <div
                          className="cursor-pointer p-2 border bg-gray-100"
                          onClick={() => handleMedicineSelect(index, hit)}
                        >
                          {hit.name}
                        </div>
                      )}
                    />
                  </InstantSearch>
                )}
                <input
                  type="text"
                  placeholder="Dosage"
                  value={medicine.dosage}
                  onChange={(e) => handleMedicineChange(e, index, "dosage")}
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={medicine.duration}
                  onChange={(e) => handleMedicineChange(e, index, "duration")}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("medicines")}
              className="text-blue-500"
            >
              + Add Medicine
            </button>

            <h3 className="text-lg font-semibold">Notes</h3>
            <textarea
              placeholder="Additional Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  notes: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Create Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
