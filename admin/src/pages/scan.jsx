"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  QrCode,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import QrScanner from "react-qr-barcode-scanner";

export default function ScanPage() {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);

    // Check for camera permissions
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          setHasPermission(true);
        })
        .catch((error) => {
          console.error("Camera permission error:", error);
          setHasPermission(false);
          setScanError(
            "Camera access denied. Please allow camera access to scan QR codes."
          );
        });
    } else {
      setHasPermission(false);
      setScanError("Camera not available on this device or browser.");
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleScan = (err, result) => {
    if (err) {
      console.error("Scan error:", err);
      setScanError("Error scanning QR code. Please try again.");
      return;
    }

    if (result && !scanned) {
      setScanned(true);
      setScanResult(result.text);

      try {
        // Parse the QR code data
        // Expected format: "ZAIN-TURF-BOOKING:ZT-1234"
        const qrData = result.text;

        if (qrData.startsWith("ZAIN-TURF-BOOKING:")) {
          const bookingId = qrData.split(":")[1];

          if (bookingId) {
            setScanError(null);
            // Show success message briefly before redirecting
            timeoutRef.current = setTimeout(() => {
              navigate(`/bookings/${bookingId}`);
            }, 1500);
          } else {
            setScanError("Invalid booking QR code format.");
            setScanned(false);
          }
        } else {
          setScanError("This QR code is not a valid Zain Turf booking code.");
          setScanned(false);
        }
      } catch (error) {
        console.error("Error processing QR code:", error);
        setScanError("Error processing QR code. Please try again.");
        setScanned(false);
      }
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanError(null);
    setScanResult(null);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-6">
        <Button variant="ghost" size="icon" asChild className="mb-2">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Scan Booking QR Code</h1>
        <p className="text-gray-500">Scan a booking QR code to view details</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Position the QR code within the scanner frame
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-square w-full bg-black">
            {hasPermission === false ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-100">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Camera Access Required
                </h3>
                <p className="text-gray-600 mb-4">{scanError}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : scanned && scanResult && !scanError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-100">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  QR Code Detected!
                </h3>
                <p className="text-gray-600">
                  Redirecting to booking details...
                </p>
              </div>
            ) : (
              <>
                {hasPermission && (
                  <QrScanner
                    onUpdate={handleScan}
                    constraints={{ facingMode: "environment" }}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 border-[40px] sm:border-[60px] border-black/50 box-border">
                  <div className="absolute inset-0 border-2 border-white/70"></div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col p-4 gap-4">
          {scanError && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{scanError}</AlertDescription>
            </Alert>
          )}

          {scanned && !scanError && (
            <Alert className="w-full bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>QR code scanned successfully!</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 w-full">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/bookings">View All Bookings</Link>
            </Button>
            {(scanned || scanError) && (
              <Button onClick={resetScanner} className="flex-1">
                Scan Again
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Having trouble scanning? You can also</p>
        <Link to="/bookings" className="text-primary hover:underline">
          search for bookings manually
        </Link>
      </div>
    </div>
  );
}

function ScannerPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center p-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-3 w-48 mx-auto" />
        <div className="mt-4 flex justify-center">
          <Camera className="h-8 w-8 text-gray-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
