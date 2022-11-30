import React, { useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import styles from "./style.module.scss";
import { BsCheckLg } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Heading from "../../../Shared/Heading/Heading";
import { shuffleArray } from "../../helper/helpers";
import toast from "react-hot-toast";

export default function ReCaptcha() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [singleData, setSingleData] = useState();
  const [imagesData, setImagesData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState({ fetch: false, verify: false });
  const [captchaInfo, setCaptchaInfo] = useState({
    sessionId: "",
    category: null,
    categoryName: "",
  });

  let showUrl =
    "https://neat-phones-push-182-185-146-215.loca.lt/api/v1/captcha/show";
  let verifyUrl =
    "https://neat-phones-push-182-185-146-215.loca.lt/api/v1/captcha/verify";

  const getCaptcha = () => {
    setLoading({ fetch: true, verify: false });
    resetStates();
    axios
      .get(showUrl)
      .then((res) => {
        setImagesData(res?.data?.data?.DATA);
        setCaptchaInfo({
          category: res?.data?.data?.category,
          sessionId: res?.data?.data?.sessionId,
          categoryName: res?.data?.data?.categoryName,
        });

        if (res?.data?.data?.DATA?.length !== undefined) {
          let resData = res.data.data.DATA.map((item) => {
            return { ...item, ischecked: 0 };
          });
          let shuffledArray = shuffleArray(resData);
          setData(shuffledArray);
        } else {
          setSingleData({ ...res?.data?.data?.DATA });
        }
        setLoading({ fetch: false, verify: false });
      })
      .catch((error) => {
        setLoading({ fetch: false, verify: false });
        console.log(error);
        setSubmitted(false);
        setErrorMessage(error?.message);
      });
  };

  const verifyCaptcha = () => {
    setLoading({ fetch: false, verify: true });
    let apiData = [];
    let obj2;
    if (imagesData instanceof Array) {
      imagesData.forEach((item) => {
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
      .post(verifyUrl, {
        answer: apiData?.length > 0 ? apiData : obj2,
        category: captchaInfo.category,
        sessionId: captchaInfo.sessionId,
      })
      .then((res) => {
        setText("");
        setMessage(res.data.data.data);
        setLoading({ fetch: false, verify: false });
        if (res.data.data.data === "unverified") {
          getCaptcha();
          toast.error("UnVerified");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error");
        setSubmitted(false);
        setVerifyError(error.message);
        setLoading({ fetch: false, verify: false });
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

  const resetStates = () => {
    setData([]);
    setText("");
    setMessage("");
    setImagesData([]);
    setSingleData([]);
    setVerifyError("");
    setErrorMessage("");
    setCaptchaInfo({ categoryName: "", sessionId: "", category: null });
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
                    <Form.Control
                      type="text"
                      value={walletAddress}
                      placeholder="0xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      onChange={(e) => setWalletAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col>
                {errorMessage ? (
                  <Row>
                    <Col>
                      <div className={styles.error}>
                        Error Fetching Captcha. Please Try Again
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {verifyError ? (
                  <Row>
                    <Col>
                      <div className={styles.error}>
                        Error Verifying Captcha. Please Try Again
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {submitted ? (
                  <Container className="w-100 mt-2">
                    <Container className={styles.SubContainerClass}>
                      <Row className={styles.RowClass}>
                        <Col>
                          {message !== "verified" && loading.fetch === false ? (
                            <Heading mainHeading>
                              Select All {captchaInfo.categoryName}
                            </Heading>
                          ) : null}
                        </Col>
                      </Row>
                    </Container>
                    <Container>
                      {loading.fetch ? (
                        <div className={styles.loading}>
                          Fetching Captcha...
                        </div>
                      ) : message === "verified" ? (
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
                                  xs="4"
                                  sm="4"
                                  md="4"
                                  lg="4"
                                  xl="4"
                                  xxl="4"
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
                                    }`}
                                    onClick={() =>
                                      handleImageSelect(item, index)
                                    }
                                  >
                                    <BsCheckLg color="green" size="25" />
                                  </span>
                                </Col>
                              );
                            })}
                          </Row>
                        </>
                      ) : singleData?.path ? (
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
                            <Form className="w-100 rounded-top">
                              <Form.Group className="mb-2 mt-3">
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Captcha Answer"
                                  value={text}
                                  onChange={(e) => setText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Form>
                          </Row>
                        </>
                      ) : null}
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
                            onClick={() => {
                              getCaptcha();
                              setSubmitted(!submitted);
                            }}
                          >
                            Submit
                          </Button>
                        ) : !loading.fetch ? (
                          <Button
                            className={styles.buttonVerify}
                            onClick={verifyCaptcha}
                            disabled={loading.verify}
                          >
                            {loading.verify ? "Verifying" : "Verify"}
                          </Button>
                        ) : null
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
