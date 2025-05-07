import React from "react";
import { FaFilePdf } from "react-icons/fa";

interface DownloadItem {
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

const CompanyProfile: React.FC = () => {
  const downloadItems: DownloadItem[] = [
    {
      title: "Company Profile",
      description:
        "We believe communication saves lives, so we inspire change by building capacity for health, social development across the spectrum of strategic communication design development.",
      fileName: "Lera Company Profile",
      fileSize: "1 file (9kb) | 17.2mb",
      fileType: "pdf",
    },
    {
      title: "Company Profile",
      description:
        "We believe communication saves lives, so we inspire change by building capacity for health, social development across the spectrum of strategic communication design development.",
      fileName: "Lera Company Profile",
      fileSize: "1 file (9kb) | 17.2mb",
      fileType: "pdf",
    },
  ];

  return (
    <div className="space-y-6 py-12 px-8 md:px-24">
      {downloadItems.map((item, index) => (
        <div key={index} className="py-6">
          <h3 className="md:text-lg text-sm font-bold font-mona">
            {item.title}
          </h3>
          <p className="text-sm font-mona font-semibold mt-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between mt-4 p-4 rounded-md border border-gray-200">
            <div className="flex items-center">
              <FaFilePdf color="red" />
              <div className="ml-4">
                <p className="text-sm font-black font-mona">{item.fileName}</p>
                <p className="text-[10px] font-black font-mona">
                  {item.fileSize}
                </p>
              </div>
            </div>
            <button className="bg-primary text-white text-sm px-4 py-2 rounded-md shadow font-mona font-semibold">
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyProfile;
