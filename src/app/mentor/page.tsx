"use client";

import { Layout } from "../layout";
import axios from "axios";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const Page = () => (
  <Layout title="멘토/멘티">
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
          <Form.Control
            as="select"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
          >
            <option value="">학년을 선택하세요</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>성별:</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
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
  </Layout>
);

export default Page;
