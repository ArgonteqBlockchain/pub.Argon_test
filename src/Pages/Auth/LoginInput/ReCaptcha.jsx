import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./style.module.scss";
import Heading from "../../../Shared/Heading/Heading";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { BsCheckLg } from "react-icons/bs";

export default function ReCaptcha() {
  const [data, setData] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [singleData, setSingleData] = useState();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState("");

  let showUrl =
    "https://neat-mirrors-mate-182-176-86-191.loca.lt/api/v1/captcha/show";

  useEffect(() => {
    axios
      .get(showUrl)

      .then((response) => {
        setImagesData(response.data.data.DATA);
        setSessionId(response.data.data.sessionId);

        if (response?.data?.data?.DATA?.length !== undefined) {
          let resData = response.data.data.DATA.map((item) => {
            return { ...item, ischecked: 0 };
          });
          setData(resData);
        } else {
          setSingleData({ ...response.data.data.DATA });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const verifyCaptcha = () => {
    let apiData = [];
    let obj2;
    if (imagesData instanceof Array) {
      imagesData.map((item) => {
        const obj = {
          id: item.id,
          answer: item.answer,
          category: item.category,
          ischecked: item.ischecked,
        };
        apiData.push(obj);
      });
    } else {
      obj2 = [
        {
          id: imagesData.id,
          answer: text,
          category: imagesData.category,
        },
      ];
    }

    axios
      .post(
        "https://neat-mirrors-mate-182-176-86-191.loca.lt/api/v1/captcha/verify",
        {
          answer: apiData?.length > 0 ? apiData : obj2,
          sessionId,
        }
      )
      .then((response) => {
        if (response.data.data.data === "unverified") {
          refreshCaptcha();
        }
        setMessage(response.data.data.data);
      })
      .catch((error) => {
        console.log(error);

        setMessage(error.data.data);
      });
  };
  const refreshCaptcha = () => {
    axios
      .get(showUrl)
      .then((response) => {
        setImagesData(response.data.data.DATA);
        setSessionId(response.data.data.sessionId);

        if (response?.data?.data?.DATA?.length !== undefined) {
          let resData = response.data.data.DATA.map((item) => {
            return { ...item, ischecked: 0 };
          });
          setData(resData);
        } else {
          setSingleData({ ...response.data.data.DATA });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleImageSelect = (item, index) => {
    let itemData = { ...item };
    let items = [...data];
    if (itemData.ischecked === 1) {
      itemData.ischecked = 0;
    } else {
      itemData.ischecked = 1;
    }
    items[index] = itemData;
    setData([...items]);
    setImagesData([...items]);
  };

  console.log({ singleData });
  return (
    <div>
      <Container className="w-100">
        <Row className={styles.gotchaheading}>
          <Col>
            <Heading mainHeading>GotcHA faucet {message?.data?.data}</Heading>
          </Col>
        </Row>
      </Container>
      <Heading mainHeading>
        {message?.data?.data ? message?.data?.data : ""}
      </Heading>

      <Container className={`col-lg-6 ${styles.width30}`}>
        <Container className={styles.contICP}>
          <Container className={styles.contICPTwo}>
            <Row>
              <Col>
                <Heading mainHeadingOne>ICP Test Tokens</Heading>
              </Col>
            </Row>
            <Row>
              <Col>
                <Heading mainHeadingTwo>Wallet Address</Heading>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form className="w-100 rounded-top">
                  <Form.Group className="mb-3">
                    <Form.Label></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      onChange={(e) => setText(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col>
                {submitted ? (
                  <Container className="w-100 mt-2">
                    <Container className={styles.SubContainerClass}>
                      <Row className={styles.RowClass}>
                        <Col className={styles.ColClass}>
                          {message !== "verified" ? (
                            <Heading mainHeading>
                              Select All{" "}
                              {singleData?.categoryName
                                ? singleData?.categoryName
                                : data?.categoryName}
                            </Heading>
                          ) : null}
                        </Col>
                      </Row>
                    </Container>
                    <Container>
                      {message === "verified" ? (
                        <Heading mainHeading>Complete</Heading>
                      ) : data?.length > 0 ? (
                        <>
                          {message === "unverified" ? (
                            <Heading mainHeading>UnVerified</Heading>
                          ) : null}
                          <Row className="d-flex justify-content-center">
                            {data.map((item, index) => {
                              return (
                                <Col
                                  xl="4"
                                  key={index}
                                  className={styles.ImageColumnClass}
                                >
                                  <img
                                    src={item.path}
                                    alt="loading"
                                    className={`${
                                      item.ischecked === 1
                                        ? styles.imageChecked
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleImageSelect(item, index)
                                    }
                                  />
                                  <span
                                    className={`${styles.imageCheckedIcon} ${
                                      item.ischecked === 0
                                        ? styles.imageSelected
                                        : null
                                    } `}
                                    onClick={() =>
                                      handleImageSelect(item, index)
                                    }
                                  >
                                    {<BsCheckLg color="green" size="25" />}
                                  </span>
                                </Col>
                              );
                            })}
                          </Row>
                        </>
                      ) : message === "verified" ? (
                        <Heading mainHeading>Complete</Heading>
                      ) : (
                        <>
                          {message === "unverified" ? (
                            <Heading mainHeading>UnVerified</Heading>
                          ) : null}
                          <Row>
                            <Col>
                              <Form>
                                <div className={styles.SingleImageClass}>
                                  <img src={singleData?.path} alt="loading" />
                                </div>
                              </Form>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Container>
                  </Container>
                ) : null}
                <Container className="mt-3">
                  <Row>
                    <Col>
                      {message !== "verified" ? (
                        !submitted ? (
                          <Button
                            className={styles.buttonVerify}
                            onClick={() => setSubmitted(!submitted)}
                          >
                            Submit
                          </Button>
                        ) : (
                          <Button
                            className={styles.buttonVerify}
                            onClick={verifyCaptcha}
                          >
                            Verify
                          </Button>
                        )
                      ) : null}
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Container>
      </Container>
    </div>
  );
}
