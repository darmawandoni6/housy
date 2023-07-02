import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Container, Form, FormGroup, Input, Label } from 'reactstrap';

import action from './data/action';
import styles from './styles.module.scss';

const Login = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.reducerLogin);
  console.log(loading);

  const handleSubmit = (e) => {
    const { username, password } = e.target.elements;

    const payload = {
      username: username.value,
      password: password.value,
    };
    dispatch(action.login(payload));
  };
  return (
    <Container className={styles.Login}>
      <Card className={styles.card}>
        <CardBody>
          <h1>Account Login</h1>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <FormGroup>
              <Label for="username">Username</Label>
              <Input id="username" name="username" placeholder="username" type="text" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input id="password" name="password" placeholder="password" type="password" />
            </FormGroup>
            <Button color="primary" className="w-100" disabled={loading}>
              Login
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;
