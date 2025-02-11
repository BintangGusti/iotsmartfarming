import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ImageSelector from "@/Components/ImageSelector";
import GardenSizeSelector from "@/Components/GardenSizeSelector";
import RowCountSelector from "@/Components/RowCountSelector";
import RowPlantSelector from "@/Components/RowPlantSelector";
import WateringTypeSelector from "@/Components/WeteringTypeSelector";
import WateringIntervalSelector from "@/Components/WeteringIntervalSelector";
import GeneratedData from "@/Components/GenerateData";

// Fungsi untuk mendapatkan URL gambar berdasarkan tanaman yang dipilih
const getImageUrlFromPlant = (plant) => {
    switch (plant) {
        case "kangkung":
            return "img/kangkung.png";
        case "bayam":
            return "img/bayam.jpg";
        case "cabe":
            return "img/cabe.jpg";
        default:
            return "img/default.png";
    }
};

function Dashboard({ auth }) {
    const [step, setStep] = useState(1);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedRowCount, setSelectedRowCount] = useState(null);
    const [plantsPerRow, setPlantsPerRow] = useState(null);
    const [autoWater, setAutoWater] = useState(null);
    const [wateringInterval, setWateringInterval] = useState(null);
    const [generatedData, setGeneratedData] = useState(null);
    const [dataGenerated, setDataGenerated] = useState(false);
    const [imageUrl, setImageUrl] = useState("img/kangkung.png");

    const handleNext = (data) => {
        if (dataGenerated) return;
        switch (step) {
            case 1:
                setSelectedPlant(data);
                setImageUrl(getImageUrlFromPlant(data));
                setStep(2);
                break;
            case 2:
                setSelectedSize(data);
                setStep(3);
                break;
            case 3:
                setSelectedRowCount(data);
                setStep(4);
                break;
            case 4:
                setPlantsPerRow(data);
                setStep(5);
                break;
            case 5:
                setAutoWater(data);
                if (!data) {
                    generateData();
                } else {
                    setStep(6);
                }
                break;
            case 6:
                setWateringInterval(data);
                generateData();
                break;
            default:
                break;
        }
    };

    const handleBack = () => {
        if (dataGenerated) return;
        if (step === 6.5) {
            setStep(5);
        } else {
            setStep(step - 1);
        }
    };

    const generateData = () => {
        const data = {
            selectedPlant,
            selectedSize,
            selectedRowCount,
            plantsPerRow,
            autoWater,
            wateringInterval,
        };
        if (!autoWater || (autoWater && wateringInterval)) {
            setGeneratedData(data);
            setDataGenerated(true);
        }
    };

    const isGenerateDisabled = () => {
        return (
            !selectedPlant ||
            !selectedSize ||
            !selectedRowCount ||
            !plantsPerRow ||
            (!autoWater && !wateringInterval)
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="app-container relative w-full h-screen overflow-hidden">
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 1 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 1 && <ImageSelector onNext={handleNext} />}
                </div>
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 2 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 2 && (
                        <GardenSizeSelector onNext={handleNext} onBack={handleBack} />
                    )}
                </div>
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 3 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 3 && (
                        <RowCountSelector onNext={handleNext} onBack={handleBack} />
                    )}
                </div>
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 4 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 4 && (
                        <RowPlantSelector onNext={handleNext} onBack={handleBack} />
                    )}
                </div>
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 5 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 5 && (
                        <WateringTypeSelector
                            onNext={handleNext}
                            onBack={handleBack}
                            onSubmit={() => {
                                if (!autoWater) {
                                    generateData();
                                } else {
                                    setStep(6);
                                }
                            }}
                        />
                    )}
                </div>
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 6.5 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 6.5 && (
                        <WateringIntervalSelector
                            onBack={handleBack}
                            onSubmit={handleNext}
                        />
                    )}
                </div>
                <div className={`step absolute w-full h-full transition-transform duration-300 ease-in-out ${step === 6 ? "translate-x-0" : "translate-x-full"}`}>
                    {step === 6 && !dataGenerated && (
                        <div>
                            {autoWater ? (
                                <WateringIntervalSelector
                                    onBack={handleBack}
                                    onSubmit={handleNext}
                                />
                            ) : (
                                <div>
                                    <button
                                        onClick={() => generateData()}
                                        disabled={isGenerateDisabled()}
                                    >
                                        Generate
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {step === 6 && dataGenerated && (
                        <GeneratedData data={generatedData} imageUrl={imageUrl} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard;