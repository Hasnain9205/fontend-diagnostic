import { useState } from "react";
import { MdCancel } from "react-icons/md"; // Close icon

const PrescriptionModal = ({
  showModal,
  closeModal,
  handleCreatePrescription,
  appointmentId,
}) => {
  const [formData, setFormData] = useState({
    symptoms: [""],
    examinations: [""],
    medicines: [{ name: "", dosage: "", duration: "" }],
    notes: "",
  });

  // Handle input change for array fields
  const handleArrayChange = (e, index, key) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedArray = [...prevData[key]];
      updatedArray[index] = value;
      return { ...prevData, [key]: updatedArray };
    });
  };

  // Add a new field for symptoms or examinations
  const addArrayField = (key) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: [...prevData[key], ""],
    }));
  };

  // Remove a field from symptoms or examinations
  const removeArrayField = (key, index) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData[key]];
      updatedArray.splice(index, 1);
      return { ...prevData, [key]: updatedArray };
    });
  };

  // Handle changes for medicines
  const handleMedicineChange = (e, index, field) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedMedicines = [...prevData.medicines];
      updatedMedicines[index][field] = value;
      return { ...prevData, medicines: updatedMedicines };
    });
  };

  // Add a new medicine field
  const addMedicineField = () => {
    setFormData((prevData) => ({
      ...prevData,
      medicines: [
        ...prevData.medicines,
        { name: "", dosage: "", duration: "" },
      ],
    }));
  };

  // Remove a medicine field
  const removeMedicineField = (index) => {
    setFormData((prevData) => {
      const updatedMedicines = [...prevData.medicines];
      updatedMedicines.splice(index, 1);
      return { ...prevData, medicines: updatedMedicines };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreatePrescription(appointmentId, formData);
  };
  console.log("fda...", formData);

  return (
    <div
      className={`${
        showModal ? "block" : "hidden"
      } fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Prescription
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Symptoms
              </label>
              {formData.symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => handleArrayChange(e, index, "symptoms")}
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField("symptoms", index)}
                    className="text-red-500"
                  >
                    <MdCancel />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("symptoms")}
                className="text-blue-500 text-sm"
              >
                + Add Symptom
              </button>
            </div>

            {/* Examinations */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Examinations
              </label>
              {formData.examinations.map((exam, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={exam}
                    onChange={(e) =>
                      handleArrayChange(e, index, "examinations")
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField("examinations", index)}
                    className="text-red-500"
                  >
                    <MdCancel />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("examinations")}
                className="text-blue-500 text-sm"
              >
                + Add Examination
              </button>
            </div>

            {/* Medicines */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medicines
              </label>
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(e, index, "name")}
                    className="w-full p-2 border rounded-md"
                  />
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
                  <button
                    type="button"
                    onClick={() => removeMedicineField(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove Medicine
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMedicineField}
                className="text-blue-500 text-sm"
              >
                + Add Medicine
              </button>
            </div>

            {/* Notes */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="notes"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="w-full p-2 border rounded-md"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-4 mt-4 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              <MdCancel className="inline mr-2" /> Cancel
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
