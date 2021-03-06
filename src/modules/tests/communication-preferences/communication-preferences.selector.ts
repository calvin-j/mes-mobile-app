import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/B';
import { get } from 'lodash';

export const getCommunicationPreferenceUpdatedEmail
  = (communicationPreferences: CommunicationPreferences) => get(communicationPreferences, 'updatedEmail', '');

export const getCommunicationPreferenceType
  = (communicationPreferences: CommunicationPreferences) => get(communicationPreferences, 'communicationMethod', '');

export const getConductedLanguage
  = (communicationPreferences: CommunicationPreferences) =>
  communicationPreferences.conductedLanguage ? communicationPreferences.conductedLanguage : '';
