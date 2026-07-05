import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface BookingDraft {
  serviceId: string | null;
  subServiceId: string | null;
  addOns: AddOn[];
  scheduledAt: string | null;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  } | null;
  couponCode: string | null;
}

interface BookingState {
  draft: BookingDraft;
  activeBookingId: string | null;
  activeBookingStatus: string | null;
}

const initialState: BookingState = {
  draft: {
    serviceId: null,
    subServiceId: null,
    addOns: [],
    scheduledAt: null,
    address: null,
    couponCode: null,
  },
  activeBookingId: null,
  activeBookingStatus: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setServiceSelection: (
      state,
      action: PayloadAction<{ serviceId: string; subServiceId: string }>
    ) => {
      state.draft.serviceId = action.payload.serviceId;
      state.draft.subServiceId = action.payload.subServiceId;
    },
    setScheduleSelection: (state, action: PayloadAction<string>) => {
      state.draft.scheduledAt = action.payload;
    },
    setAddressSelection: (
      state,
      action: PayloadAction<NonNullable<BookingDraft['address']>>
    ) => {
      state.draft.address = action.payload;
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      state.draft.couponCode = action.payload;
    },
    toggleAddOn: (state, action: PayloadAction<AddOn>) => {
      const idx = state.draft.addOns.findIndex((item) => item.id === action.payload.id);
      if (idx > -1) {
        state.draft.addOns.splice(idx, 1);
      } else {
        state.draft.addOns.push(action.payload);
      }
    },
    setActiveBooking: (
      state,
      action: PayloadAction<{ bookingId: string; status: string }>
    ) => {
      state.activeBookingId = action.payload.bookingId;
      state.activeBookingStatus = action.payload.status;
    },
    clearBookingDraft: (state) => {
      state.draft = {
        serviceId: null,
        subServiceId: null,
        addOns: [],
        scheduledAt: null,
        address: null,
        couponCode: null,
      };
    },
    resetBookingState: (state) => {
      state.draft = {
        serviceId: null,
        subServiceId: null,
        addOns: [],
        scheduledAt: null,
        address: null,
        couponCode: null,
      };
      state.activeBookingId = null;
      state.activeBookingStatus = null;
    },
  },
});

export const {
  setServiceSelection,
  setScheduleSelection,
  setAddressSelection,
  applyCoupon,
  toggleAddOn,
  setActiveBooking,
  clearBookingDraft,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
