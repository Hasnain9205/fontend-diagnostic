import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import { useParams } from "react-router-dom";
import { getAccessToken } from "../../../Utils";

const PrescriptionDetail = () => {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get(
          `/prescriptions/get-prescription-by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrescription(response.data.prescription);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch prescription details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  const handlePrint = () => {
    const printContent = document.querySelector(".print-content");
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto border border-gray-300 shadow-lg bg-gradient-to-r from-yellow-200 to-white-400">
      <div className="print-content">
        {prescription ? (
          <>
            {/* Doctor and Center Details */}
            <div className="flex flex-wrap justify-between bg-blue-100 border-b-2 pt-4">
              <div className="w-full sm:w-1/2 lg:w-1/3 px-14 pl-20">
                <h2 className="text-xl font-semibold text-blue-700">
                  {prescription?.docId?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {prescription?.docId?.speciality}
                </p>
                <p className="text-sm text-gray-600">
                  {prescription?.docId?.degree}
                </p>
                <p className="text-sm text-gray-600">
                  {prescription?.docId?.chamber}
                </p>
              </div>
              <div className="w-full sm:w-1/2 lg:w-1/3 mb-6 px-8">
                <h2 className="text-xl font-semibold text-blue-700">
                  {prescription?.centerId?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {prescription?.centerId?.district &&
                    `${prescription?.centerId?.district}, `}
                  {prescription?.centerId?.upazila &&
                    `${prescription?.centerId?.upazila}`}
                </p>
                <p className="text-sm text-gray-600">
                  {prescription?.centerId?.address?.line1 &&
                    `${prescription?.centerId?.address?.line1}, `}
                  {prescription?.centerId?.address?.line2 &&
                    `${prescription?.centerId?.address?.line2}`}
                </p>
                <p className="text-sm text-gray-600">
                  {prescription?.centerId?.phone}
                </p>
              </div>
            </div>
            <div className="flex justify-between px-24 bg-blue-200 border-b-2">
              <div>Name: {prescription?.patientId?.name}</div>
              <div>Age: {prescription?.patientId?.age}</div>
            </div>

            {/* Symptoms, Examinations, and Medications */}
            <div className="flex h-[650px]">
              <div className="bg-red-100 px-8 pt-10 py-4 pl-16 sm:w-1/2 lg:w-1/4">
                <h3 className="text-lg font-bold text-gray-700">Symptoms</h3>
                <ul className="list-disc h-56 pl-5 text-sm text-gray-600">
                  {(Array.isArray(prescription?.symptoms)
                    ? prescription?.symptoms
                    : prescription?.symptoms?.split(",")
                  )?.map((symptom, index) => (
                    <li key={index}>{symptom.trim()}</li>
                  )) || <p>No symptoms available.</p>}
                </ul>

                <h3 className="text-lg font-bold text-gray-700 mt-4">
                  Examinations
                </h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {(Array.isArray(prescription?.examinations)
                    ? prescription?.examinations
                    : prescription?.examinations?.split(",")
                  )?.map((examination, index) => (
                    <li key={index}>{examination.trim()}</li>
                  )) || <p>No examinations available.</p>}
                </ul>
              </div>
              <div className="w-full  px-8 pt-10 py-4 pl-16 bg-yellow-100 sm:w-1/2 lg:w-1/3 ">
                <h3 className="text-lg font-bold text-gray-700">Rx</h3>
                {prescription?.medicines?.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {prescription.medicines.map((med, index) => (
                      <li key={index}>
                        <p>
                          <strong>{med.name}</strong>
                        </p>
                        <p>
                          {med.dosage}
                          <strong> - {med.duration}</strong>
                        </p>
                        <hr className="my-2 border-gray-300" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No medications available.</p>
                )}
              </div>
            </div>

            {/* Follow-up Message */}
            <div className="text-center bg-gray-200 p-6">
              <p className="text-xl font-semibold text-gray-700">
                {prescription?.notes}
              </p>
            </div>
          </>
        ) : (
          <p>No prescription details available.</p>
        )}
      </div>

      {/* Print Button */}
      <div className="text-center">
        <button
          className="px-8 py-3 bg-gray-700 w-full text-white hover:bg-gray-600 transition hidden-on-print"
          onClick={handlePrint}
        >
          Print Prescription
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetail;
