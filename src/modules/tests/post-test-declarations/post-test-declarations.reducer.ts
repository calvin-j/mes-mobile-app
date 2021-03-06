import { PostTestDeclarations } from '@dvsa/mes-test-schema/categories/B';
import * as postTestDeclarationActions from './post-test-declarations.actions';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: PostTestDeclarations = {
  healthDeclarationAccepted: false,
  passCertificateNumberReceived: false,
  postTestSignature: '',
};

export function postTestDeclarationsReducer(
  state = initialState,
  action: postTestDeclarationActions.Types,
): PostTestDeclarations {
  switch (action.type) {
    case postTestDeclarationActions.CLEAR_DECLARATIONS:
      return initialState;
    case postTestDeclarationActions.TOGGLE_HEALTH_DECLARATION:
      return {
        ...state,
        healthDeclarationAccepted: !state.healthDeclarationAccepted,
      };
    case postTestDeclarationActions.TOGGLE_RECEIPT_DECLARATION:
      return {
        ...state,
        passCertificateNumberReceived: !state.passCertificateNumberReceived,
      };
    case postTestDeclarationActions.SIGNATURE_DATA_CHANGED:
      return {
        ...state,
        postTestSignature: action.payload,
      };
    case postTestDeclarationActions.SIGNATURE_DATA_CLEARED:
      return {
        ...state,
        postTestSignature: '',
      };

    default:
      return state;
  }
}

export const getPostTestDeclarations = createFeatureSelector<PostTestDeclarations>('postTestDeclarations');
