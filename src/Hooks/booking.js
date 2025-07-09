import { message } from "antd";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Contexts/AppContext";
import { v4 as uuidv4 } from "uuid";
import { BOOKING_MODES, UNIT_STATUS } from "../Data";
import { getUniquId } from "../Utility/function";
import { useInventories } from "./index";
import api from '../config/api';

const isUserExists = (db_details, userDetails) => {
  const { email, firstName, flatId, lastName } = userDetails;
  const {
    email: db_email,
    firstName: db_firstName,
    flatId: db_flatId,
    lastName: db_lastName,
  } = db_details;

  if (
    db_email === email &&
    db_firstName === firstName &&
    flatId === db_flatId &&
    lastName === db_lastName
  )
    return true;
  return false;
};

export const useBookings = () => {
  const { bookings, setBookings, users, setUsers } = useContext(AppContext);
  const [bookingsList, setBookingsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const { updateInventory } = useInventories();

  useEffect(() => {
    if (bookings)
      setBookingsList(
        Object.keys(bookings).map((id) => ({
          ...bookings[id],
          id,
        }))
      );
  }, [bookings]);

  useEffect(() => {
    if (users)
      setUsersList(
        Object.keys(users).map((id) => ({
          ...users[id],
          id,
        }))
      );
  }, [users]);

  const changeStatusInBulk = (ids = [], status) =>
    ids.forEach((id) => updateInventory(id, "Status", status));

  const saveBookingToDB = async (bookingDetails) => {
    try {
      const details = {
        ...bookingDetails,
        timestamp: new Date().getTime(),
      };
      const response = await api.post('/bookings', details);
      return response.data;
    } catch (error) {
      console.error('Error saving booking:', error);
      message.error('Failed to save booking');
      throw error;
    }
  };

  const saveUserToDB = async (userDetails) => {
    try {
      const details = {
        ...userDetails,
        timestamp: new Date().getTime(),
      };
      const response = await api.post('/users', details);
      return response.data.id;
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Failed to save user');
      throw error;
    }
  };

  const fetchBookings = async (setLoading = () => {}) => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (setLoading = () => {}) => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return {
    saveBookingToDB,
    fetchBookings,
    fetchUsers,
    bookingsList,
    usersList,
    bookings,
    setBookingsList,
    saveUserToDB,
    changeStatusInBulk,
  };
};
