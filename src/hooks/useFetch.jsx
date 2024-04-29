import axios from "axios";
import React, { useState, useEffect } from "react";
import axiosInstance from "../Axios/axios";
import authService from "../componets/Services/authService";

function useFetch({ url }) {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from:", url);
        const response = await axiosInstance.get(url);

        if (response && response.data) {
          setData(response.data);
        } else {
          console.error("Invalid response structure:", response);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, [url]);
  return { error, data, loading };
}

export default useFetch;
