import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { unapprovedPersonalSignMsg } from '../../../../test/data/confirmations/personal_sign';
import {
  orderSignatureMsg,
  permitSignatureMsg,
  unapprovedTypedSignMsgV4,
} from '../../../../test/data/confirmations/typed_sign';
import mockState from '../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../test/lib/render-helpers';

import Confirm from './confirm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

const middleware = [thunk];

describe('Confirm', () => {
  it('should render', () => {
    const mockStore = configureMockStore(middleware)(mockState);
    const { container } = renderWithProvider(<Confirm />, mockStore);
    expect(container).toBeDefined();
  });

  it('should match snapshot for signature - typed sign - permit', () => {
    const mockStateTypedSign = {
      ...mockState,
      metamask: {
        ...mockState.metamask,
      },
      confirm: { currentConfirmation: permitSignatureMsg },
    };
    const mockStore = configureMockStore(middleware)(mockStateTypedSign);
    const { container } = renderWithProvider(<Confirm />, mockStore);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for signature - personal sign type', () => {
    const mockStatePersonalSign = {
      ...mockState,
      metamask: {
        ...mockState.metamask,
      },
      confirm: { currentConfirmation: unapprovedPersonalSignMsg },
    };
    const mockStore = configureMockStore(middleware)(mockStatePersonalSign);
    const { container } = renderWithProvider(<Confirm />, mockStore);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot signature - typed sign - order', () => {
    const mockStateTypedSign = {
      ...mockState,
      metamask: {
        ...mockState.metamask,
      },
      confirm: { currentConfirmation: orderSignatureMsg },
    };
    const mockStore = configureMockStore(middleware)(mockStateTypedSign);
    const { container } = renderWithProvider(<Confirm />, mockStore);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for signature - typed sign - V4', async () => {
    const mockStateTypedSign = {
      ...mockState,
      metamask: {
        ...mockState.metamask,
      },
      confirm: { currentConfirmation: unapprovedTypedSignMsgV4 },
    };
    const mockStore = configureMockStore(middleware)(mockStateTypedSign);
    const { container } = renderWithProvider(<Confirm />, mockStore);
    expect(container).toMatchSnapshot();
  });
});
