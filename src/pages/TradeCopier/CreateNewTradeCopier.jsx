import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

import api from '../../utils/api';
import useToast from '../../hooks/useToast';

function CreateNewTradeCopier() {
  const { showToast } = useToast();

  const initialValues = {
    copyFrom: '',
    sendTo: '',
    name: '',
  };
  const [values, setValues] = React.useState(initialValues);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    React.useState(false);
  const [createCopierButtonClicked, setCreateCopierButtonClicked] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [accountData, setAccountData] = React.useState([]);
  const [strategyData, setStrategyData] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchData() {
      // let tempStrategy = [];
      const response = await api.get('/account/my-accounts');
      const responseStrategyList = await api.get('/strategy/strategies');
      setAccountData(response.data.data);
      setStrategyData(responseStrategyList.data.data);
      console.log(response.data.data);
      console.log(responseStrategyList.data.data);
    }

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleCreateCopierButtonClick = async () => {
    try {
      setCreateCopierButtonClicked(true);
      if (
        values.copyFrom == '' ||
        values.sendTo == '' ||
        values.name == '' ||
        isTermsAndConditionsChecked == false
      ) {
        showToast('Please fill in all the information!', 'error');
      } else {
        setIsLoading(true);
        await api.post('/subscriber/update-signals', {
          SubscriberName: values.name,
          strategyIDs: [values.copyFrom],
          SubscriberID: values.sendTo,
        });
        showToast('New copier created successfully!', 'success');
        setIsLoading(false);
        navigate('/trade-copier');
      }
    } catch (err) {
      showToast('New copier creation failed!', 'error');
      console.log(err);
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div style={{ padding: '0px 200px' }}>
        <div className="pb-3">
          <Link
            to={'/trade-copier'}
            className="flex flex-row items-center font-extrabold"
          >
            <ReplyRoundedIcon
              fontSize="medium"
              sx={{ color: 'white', fontWeight: 'bold' }}
            />
            <h1 className="text-white text-lg pl-2"> My Copiers</h1>
          </Link>
        </div>
        <div
          className="mb-[20px] rounded bg-[#282D36]"
          style={{ color: 'white' }}
        >
          <header className="p-[18px]">
            <h2 className="mt-[5px] text-[20px] font-normal">
              Create New Trade Copier
            </h2>
          </header>
          <div
            className="p-[15px] bg-[#2E353E]"
            style={{ boxSizing: 'border-box' }}
          >
            <div
              style={{
                borderBottom: '1px solid #242830',
                paddingBottom: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'start',
              }}
            >
              <label
                className="text-[#ccc] text-[13px]"
                style={{
                  textAlign: 'right',
                  width: '25%',
                  paddingTop: '7px',
                  paddingRight: '15px',
                  paddingLeft: '15px',
                  display: 'inline-block',
                  position: 'relative',
                  maxWidth: '100%',
                }}
              >
                Copy from
              </label>
              <div
                style={{
                  width: '50%',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                <select
                  name="copyFrom"
                  required
                  className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '34px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                  }}
                  onChange={handleInputChange}
                >
                  <optgroup label="Signals" className="text-gray-500">
                    <option value="" disabled selected className="hidden">
                      Select Account
                    </option>
                    {strategyData.length > 0 &&
                      strategyData
                        // .filter(
                        //   (account) =>
                        //     account.copyFactoryRoles.indexOf('PROVIDER') !== -1
                        // )
                        .map((account) => (
                          <option
                            key={account.account[0]._id}
                            value={account.strategyId}
                            className="text-white"
                          >{`${account.name}(${account.strategyId})`}</option>
                        ))}
                  </optgroup>
                  {/* <optgroup label="My Accounts" className="text-gray-500">
                    {accountData.length > 0 &&
                      accountData
                        .filter(
                          (account) =>
                            account.copyFactoryRoles.indexOf('SUBSCRIBER') !==
                            -1
                        )
                        .map((account) => (
                          <option
                            key={account.accountId}
                            value={account.accountId}
                            className="text-white"
                          >{`${account.name}(${account.login})`}</option>
                        ))}
                  </optgroup> */}
                </select>
                {values.copyFrom == '' && createCopierButtonClicked && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                    Copy from required!
                  </p>
                )}
              </div>
            </div>
            <div
              style={{
                borderBottom: '1px solid #242830',
                paddingBottom: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'start',
              }}
            >
              <label
                className="text-[#ccc] text-[13px]"
                style={{
                  textAlign: 'right',
                  width: '25%',
                  paddingTop: '7px',
                  paddingRight: '15px',
                  paddingLeft: '15px',
                  display: 'inline-block',
                  position: 'relative',
                  maxWidth: '100%',
                }}
              >
                Send to
              </label>
              <div
                style={{
                  width: '50%',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                <select
                  name="sendTo"
                  required
                  className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '34px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                  }}
                  onChange={handleInputChange}
                >
                  <option value="" disabled selected className="hidden">
                    Select Account
                  </option>
                  {accountData.length > 0 &&
                    accountData
                      .filter(
                        (account) =>
                          account.copyFactoryRoles.indexOf('SUBSCRIBER') !== -1
                      )
                      .map((account) => (
                        <option
                          key={account.accountId}
                          value={account.accountId}
                          className="text-white"
                        >{`${account.name}(${account.login})`}</option>
                      ))}
                </select>
                {values.sendTo == '' && createCopierButtonClicked && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                    Send to required!
                  </p>
                )}
              </div>
            </div>
            <div
              style={{
                borderBottom: '1px solid #242830',
                paddingBottom: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'start',
              }}
            >
              <label
                className="text-[#ccc] text-[13px]"
                style={{
                  textAlign: 'right',
                  width: '25%',
                  paddingTop: '7px',
                  paddingRight: '15px',
                  paddingLeft: '15px',
                  display: 'inline-block',
                  position: 'relative',
                  maxWidth: '100%',
                }}
              >
                Name
              </label>
              <div
                style={{
                  width: '50%',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '34px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                  }}
                  onChange={handleInputChange}
                />
                {values.name == '' && createCopierButtonClicked && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                    Name required!
                  </p>
                )}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
              }}
            >
              <label
                className="text-[#ccc] text-[13px]"
                style={{
                  textAlign: 'right',
                  width: '25%',
                  paddingTop: '7px',
                  paddingRight: '15px',
                  paddingLeft: '15px',
                  display: 'inline-block',
                  position: 'relative',
                  maxWidth: '100%',
                }}
              ></label>
              <div
                style={{
                  width: '50%',
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                <div className="flex items-center gap-1 pt-[7px]">
                  <input
                    name="subscriber"
                    type="checkbox"
                    required
                    className="bg-[#282d36] text-[#fff] px-3 py-1.5 rounded w-4"
                    onChange={() =>
                      setIsTermsAndConditionsChecked(
                        !isTermsAndConditionsChecked
                      )
                    }
                  />
                  <label
                    className="text-[#ccc] text-[13px]"
                    style={{
                      width: '100%',
                      paddingRight: '15px',
                      paddingLeft: '5px',
                      display: 'inline-block',
                      position: 'relative',
                      maxWidth: '100%',
                    }}
                  >
                    I have read the T&C&apos;s
                  </label>
                </div>
                {createCopierButtonClicked &&
                  isTermsAndConditionsChecked == false && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                      Please check T&C!
                    </p>
                  )}
              </div>
            </div>
          </div>
          <footer className="px-[15px] py-[10px]">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-start-4 col-span-4 pl-3.5">
                <LoadingButton
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#0088CC!important',
                  }}
                  onClick={handleCreateCopierButtonClick}
                  loading={isLoading}
                >
                  Create Copier
                </LoadingButton>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default CreateNewTradeCopier;
