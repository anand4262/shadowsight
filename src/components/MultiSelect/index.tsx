"use client"
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/Store";
import Select, { MultiValue }  from 'react-select';
import makeAnimated from 'react-select/animated';
import {options, defaultSelected} from './data'
import { setSelectedPermissions } from '@/store/slices/GraphComponentSlice';
import { Permission } from '@/store/types/GraphComponentTypes';

const animatedComponents = makeAnimated();

const defaultSelect: Permission[] = defaultSelected;

const MultiSelect = () => {
    const dispatch = useDispatch<AppDispatch>();
   // const options = useSelector((state: RootState) => state.selected.selected);

    const handleChange = (selected: MultiValue<Permission>) => {
        dispatch(setSelectedPermissions(selected as Permission[]));
      };

      useEffect(() => {
        dispatch(setSelectedPermissions(defaultSelect));
      }, [dispatch]);

  return (
    <Select
              placeholder="Please select the graphs"
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={defaultSelected}
              isMulti
              options={options}
              onChange={handleChange}
    />
  )
}

export default MultiSelect