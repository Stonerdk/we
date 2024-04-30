"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import axios from "axios";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Protected from "../protected";

const Page = () => (
  <Protected>
    <CommonLayout title="멘토/멘티">mento/mentee</CommonLayout>
  </Protected>
);

export default Page;
