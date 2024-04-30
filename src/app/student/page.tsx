"use client";

import { CommonLayout } from "@/components/background/commonLayout";
import axios from "axios";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Protected from "../protected";

const Page = () => {
  interface FormData {
    name: string;
    grade: string;
    gender: string;
    bio: string;
  }

  const initialValues: FormData = {
    name: "",
    grade: "",
    gender: "",
    bio: "",
  };

  const [formData, setFormData] = useState<FormData>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const postData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/student", formData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to submit form.");
    }
  };

  return (
    <Protected>
      <CommonLayout title="참여학생">
        <div>
          <Form onSubmit={postData}>
            <Form.Group>
              <Form.Label>이름:</Form.Label>
              <Form.Control
                type="text"
                placeholder="이름을 입력하세요"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>학년:</Form.Label>
              <Form.Control as="select" name="grade" value={formData.grade} onChange={handleChange}>
                <option value="">학년을 선택하세요</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>성별:</Form.Label>
              <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">성별을 선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>한 줄 소개:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="한 줄 소개를 입력하세요"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              제출
            </Button>
          </Form>
        </div>
      </CommonLayout>
    </Protected>
  );
};

export default Page;
