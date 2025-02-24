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
    medicines: [{ name: "", dosage: "", duration: "", searchVisible: false }],
    notes: "",
  });
  const [symptomResults, setSymptomResults] = useState({});
  const [examinationResults, setExaminationResults] = useState({});
  const [noteResults, setNoteResults] = useState("");

  const handleNoteSearch = async (query) => {
    const { results } = await searchClient.search([
      {
        indexName: "notes",
        query,
        params: { hitsPerPage: 5 },
      },
    ]);
    setNoteResults(results[0]?.hits || "");
  };
  const addArrayField = (key, newValue = "") => {
    setFormData((prevData) => {
      const isDuplicate = prevData[key].some((item) => {
        if (key === "medicines") {
          return item.name === newValue;
        } else {
          return item === newValue;
        }
      });

      if (isDuplicate) {
        alert(`${key.slice(0, -1)} already exists!`);
        return prevData;
      }

      const newItem =
        key === "medicines"
          ? { name: newValue, dosage: "", duration: "", searchVisible: false }
          : newValue;

      return { ...prevData, [key]: [...prevData[key], newItem] };
    });
  };

  const handleSymptomSearch = async (index, query) => {
    if (query.trim() === "") {
      setSymptomResults((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    const { results } = await searchClient.search([
      {
        indexName: "symptoms",
        query,
        params: { hitsPerPage: 5 },
      },
    ]);

    setSymptomResults((prev) => ({ ...prev, [index]: results[0]?.hits || [] }));
  };

  const handleExaminationSearch = async (index, query) => {
    if (query.trim() === "") {
      setExaminationResults((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    const { results } = await searchClient.search([
      {
        indexName: "examinations",
        query,
        params: { hitsPerPage: 5 },
      },
    ]);

    setExaminationResults((prev) => ({
      ...prev,
      [index]: results[0]?.hits || [],
    }));
  };

  const removeArrayField = (key, index) => {
    setFormData((prevData) => {
      const updatedArray = prevData[key].filter((_, idx) => idx !== index);
      return { ...prevData, [key]: updatedArray };
    });
  };
  const handleMedicineChange = (e, index, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      medicines: prevData.medicines.map((med, idx) =>
        idx === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleMedicineSelect = (index, hit) => {
    setFormData((prevData) => {
      const updatedMedicines = [...prevData.medicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        name: hit.name,
        dosage: hit.dosage, // সিলেক্টেড medicine এর dosage সেট করবো
        duration: hit.duration, // সিলেক্টেড medicine এর duration সেট করবো
        searchVisible: false, // Search বন্ধ করে দিবো
      };
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
            {/* Symptoms Section */}
            <h3 className="text-lg font-semibold">Symptoms</h3>
            {formData.symptoms.map((symptom, index) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for a symptom..."
                    value={symptom}
                    onChange={(e) => {
                      const newSymptoms = [...formData.symptoms];
                      newSymptoms[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        symptoms: newSymptoms,
                      }));
                      handleSymptomSearch(index, e.target.value);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                  {symptomResults[index]?.map((hit, hitIndex) => (
                    <div
                      key={hitIndex}
                      className="cursor-pointer p-2 hover:bg-gray-200 bg-white border"
                      onClick={() => {
                        const newSymptoms = [...formData.symptoms];
                        newSymptoms[index] = hit.symptom;
                        setFormData((prev) => ({
                          ...prev,
                          symptoms: newSymptoms,
                        }));
                        setSymptomResults((prev) => ({ ...prev, [index]: [] }));
                      }}
                    >
                      {hit.symptom}
                    </div>
                  ))}
                </div>
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

            {/* Examinations Section */}
            <h3 className="text-lg font-semibold">Examinations</h3>
            {formData.examinations.map((examination, index) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for a examination..."
                    value={examination}
                    onChange={(e) => {
                      const newExaminations = [...formData.examinations];
                      newExaminations[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        examinations: newExaminations,
                      }));
                      handleExaminationSearch(index, e.target.value);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                  {examinationResults[index]?.map((hit, hitIndex) => (
                    <div
                      key={hitIndex}
                      className="cursor-pointer p-2 hover:bg-gray-200 bg-white border"
                      onClick={() => {
                        const newExaminations = [...formData.examinations];
                        newExaminations[index] = hit.examination;
                        setFormData((prev) => ({
                          ...prev,
                          examinations: newExaminations,
                        }));
                        setExaminationResults((prev) => ({
                          ...prev,
                          [index]: [],
                        }));
                      }}
                    >
                      {hit.examination}
                    </div>
                  ))}
                </div>
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

            {/* Medicines Section */}
            <h3 className="text-lg font-semibold">Medicines</h3>
            {formData.medicines.map((medicine, index) => (
              <div key={index} className="space-y-2">
                {/* Medicine Name */}
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

                {/* Medicine Search */}
                {medicine.searchVisible && (
                  <div className="relative">
                    <InstantSearch
                      searchClient={searchClient}
                      indexName="medicines"
                    >
                      <SearchBox
                        placeholder="Search medicines..."
                        className="w-full p-2 border rounded-md"
                      />
                      <Configure hitsPerPage={5} />
                      <div className="absolute bg-white w-full shadow-lg z-10">
                        <Hits
                          hitComponent={({ hit }) => (
                            <div
                              className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                              onClick={() => handleMedicineSelect(index, hit)}
                            >
                              {hit.name}
                            </div>
                          )}
                        />
                      </div>
                    </InstantSearch>
                  </div>
                )}

                {/* Dosage Search */}
                <input
                  type="text"
                  placeholder="dosage"
                  value={medicine.dosage}
                  onChange={(e) => handleMedicineChange(e, index, "dosage")}
                  className="w-full p-2 border rounded-md"
                />

                {/* Duration Input */}
                <input
                  type="text"
                  placeholder="Duration"
                  value={medicine.duration}
                  onChange={(e) => handleMedicineChange(e, index, "duration")}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}

            {/* Add Medicine Button */}
            <button
              type="button"
              onClick={() => addArrayField("medicines")}
              className="text-blue-500"
            >
              + Add Medicine
            </button>

            {/* Notes Section */}
            <h3 className="text-lg font-semibold">Notes</h3>

            <div className="relative">
              <textarea
                placeholder="Additional Notes"
                value={formData.notes}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, notes: e.target.value }));
                  handleNoteSearch(e.target.value);
                }}
                className="w-full p-2 border rounded-md"
              ></textarea>
              {noteResults.length > 0 && (
                <div className="absolute bg-white w-full shadow-lg z-10">
                  {noteResults.map((hit, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, notes: hit.notes }));
                        setNoteResults([]);
                      }}
                    >
                      {hit.notes}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
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
