import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./style.module.scss";
import Heading from "../../../Shared/Heading/Heading";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import imageone from "../../../Assets/Images/imageone.jpg";
import { BsCheckLg } from "react-icons/bs";

export default function ReCaptcha() {
  const [data, setData] = useState([]);
  // const [testData, setTestData] = useState([...dummyData]);
  const [imagesData, setImagesData] = useState([]);
  const [singleData, setSingleData] = useState();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const handleChange = (item) => {
    // console.log("item handle change", item);
    let newArray = [...imagesData];
    if (newArray.includes(item.ischecked)) {
      item.ischecked = 1;
      newArray = newArray.filter((data) => data !== item.ischecked);
    } else {
      if (item.ischecked == 1) {
        item.ischecked = 0;
      } else {
        item.ischecked = 1;
      }
    }

    // console.log("newArray in handle change2", newArray);
    setImagesData([...newArray]);
  };
  useEffect(() => {
    axios
      // .get("https://f6c4-182-185-191-116.in.ngrok.io/api/v1/captcha/show")
      .get(
        "https://easy-moments-spend-182-176-86-191.loca.lt/api/v1/captcha/show"
      )

      .then(function (response) {
        console.log("RESPONES: ", response);
        setImagesData(response.data.data.DATA);
        setSessionId(response.data.data.sessionId);

        // console.log(response.data.data.DATA.length, "response");
        let resData = response.data.data;

        if (resData?.DATA?.length === undefined) {
          setSingleData(resData);
        } else {
          resData?.DATA?.forEach((object) => {
            object.ischecked = 0;
            // object.ischecked=false;
          });
          setData(resData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  console.log({ sessionId });

  const verifyCaptcha = () => {
    let apiData = [];
    // console.log("imagesData in verified", typeof imagesData);
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
        "https://easy-moments-spend-182-176-86-191.loca.lt/api/v1/captcha/verify",
        {
          answer: apiData?.length > 0 ? apiData : obj2,
          sessionId,
          // ischecked: apiData?.length > 0? true : false,
        }
      )
      .then((response) => {
        if (response.data.data.data === "unverified") {
          refreshCaptcha();
        }
        setMessage(response.data.data.data);
        // console.log(response.data.data.data, "response data data");
      })
      .catch((error) => {
        console.log(error);

        setMessage(error.data.data);
      });
  };
  const refreshCaptcha = () => {
    axios
      .get("https://f6c4-182-185-191-116.in.ngrok.io/api/v1/captcha/show")
      .then((response) => {
        // console.log("RESPONES: ", response);
        setImagesData(response.data.data.DATA);
        // console.log(response.data.data.DATA.length, "response");
        let resData = response.data.data;

        if (resData?.DATA?.length === undefined) {
          setSingleData(resData);
        } else {
          resData?.DATA?.forEach((object) => {
            object.ischecked = 0;
            // object.ischecked=false;
          });
          setData(resData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleImageSelect = (item, index) => {
    // console.log("item handle change", item);
    let newArray = [...imagesData];
    if (newArray.includes(item.ischecked)) {
      item.ischecked = 1;
      newArray = newArray.filter((data) => data !== item.ischecked);
    } else {
      if (item.ischecked == 1) {
        item.ischecked = 0;
      } else {
        item.ischecked = 1;
      }
    }

    // console.log("newArray in handle change2", newArray);
    setImagesData([...newArray]);

    let itemData = { ...item };
    itemData.checked = itemData.checked ? false : true;
    data[index] = itemData;
    setData([...data]);
  };
  return (
    <div>
      <Container className="w-100">
        <Row className={styles.gotchaheading}>
          <Col>
            <Heading mainHeading>GotcHA faucet {message?.data?.data}</Heading>
          </Col>
        </Row>
      </Container>
      <Heading mainHeading>{message?.data?.data}</Heading>

      <Container className="col-lg-6">
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
                      onChange={(event) => setText(event.target.value)}
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
                                : data?.categoryName}{" "}
                            </Heading>
                          ) : null}
                        </Col>
                      </Row>
                    </Container>
                    <Container>
                      {message === "verified" ? (
                        <Heading mainHeading>Complete</Heading>
                      ) : data?.DATA?.length > 0 ? (
                        <>
                          {message === "unverified" ? (
                            <Heading mainHeading>UnVerified</Heading>
                          ) : null}
                          <Row className="d-flex justify-content-center">
                            {data?.DATA?.map((item, index) => {
                              return (
                                <Col className={styles.ImageColumnClass} xl="4">
                                  <input
                                    className={styles.ImageColumnClassOne}
                                    type="checkbox"
                                    onChange={() => handleChange(item, index)}
                                  />
                                  <img
                                    src={item.path}
                                    alt="loading"
                                    className={`${
                                      item.checked ? styles.imageChecked : ""
                                    }`}
                                    onClick={() => {
                                      handleImageSelect(item, index);
                                    }}
                                  />
                                  <span
                                    className={`${styles.imageCheckedIcon} ${
                                      !item.checked
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
                                  <img src={singleData?.DATA?.path} />
                                </div>
                              </Form>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Container>
                  </Container>
                ) : (
                  <Container>
                    <Row>
                      <Col>
                        {" "}
                        {/* <Button
                          className={styles.class2}
                          onClick={(e) => {setHidden((e) => !e);Verified(e);}}

                        >
                          Verify
                        </Button> */}
                      </Col>
                    </Row>
                  </Container>
                )}
                <Container className="mt-3">
                  <Row>
                    <Col>
                      {message !== "verified" ? (
                        !submitted ? (
                          <Button
                            className={styles.buttonVerify}
                            onClick={() => {
                              setSubmitted(!submitted);
                            }}
                          >
                            Submit
                          </Button>
                        ) : (
                          <Button
                            className={styles.buttonVerify}
                            onClick={() => {
                              verifyCaptcha();
                              // setSubmitted(!submitted);
                            }}
                          >
                            Verify
                          </Button>
                        )
                      ) : null}
                    </Col>
                  </Row>
                </Container>

                {/* <Button
                  className={styles.class2}
                  onClick={() => {
                    Verified();
                  }}
                >
                  Verify
                </Button> */}
              </Col>
            </Row>

            {/* <Container className="w-100 mt-2">
              <Container className={styles.SubContainerClass}>
                <Row className={styles.RowClass}>
                  <Col className={styles.ColClass}>
                    <Heading mainHeading>
                      Select All{" "}
                      {singleData?.categoryName
                        ? singleData?.categoryName
                        : data?.categoryName}{" "}
                    </Heading>
                  </Col>
                </Row>
              </Container>
              <Container>
                {data?.DATA?.length > 0 ? (
                  <Row>
                    {data?.DATA?.map((item, index) => {
                      return (
                        <Col className={styles.ImageColumnClass} xl="4">
                          <input
                            className={styles.ImageColumnClassOne}
                            type="checkbox"
                            onChange={() => handleChange(item, index)}
                          />
                          <img src={item.path} />
                          <Alert>{data.DATA.message}</Alert>
                        </Col>
                      );
                    })}
                  </Row>
                ) : (
                  <Row>
                    <Col>
                      <Form>
                        <div className={styles.SingleImageClass}>
                          <img src={singleData?.DATA?.path} />
                        </div>
                      </Form>
                    </Col>
                  </Row>
                )}
              </Container>
            </Container> */}
          </Container>
        </Container>
      </Container>
    </div>
  );
}
