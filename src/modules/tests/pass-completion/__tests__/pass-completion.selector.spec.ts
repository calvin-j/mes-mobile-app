import { PassCompletion } from '@dvsa/mes-test-schema/categories/B';
import {
  getPassCertificateNumber,
  provisionalLicenseProvided,
  provisionalLicenseNotProvided,
} from '../pass-completion.selector';

describe('pass completion selector', () => {
  const state: PassCompletion = {
    provisionalLicenceProvided: true,
    passCertificateNumber: 'ABC123',
  };

  describe('getPassCertificateNumber', () => {
    it('should retrieve the pass certificate number', () => {
      expect(getPassCertificateNumber(state)).toBe('ABC123');
    });
  });

  describe('provisionalLicenseProvided', () => {
    it('should retrieve whether the provisional license was provided', () => {
      expect(provisionalLicenseProvided(state)).toBe(true);
    });
  });

  describe('provisionalLicenseNotProvided', () => {
    it('should retrieve whether the provisional license was provided', () => {
      expect(provisionalLicenseNotProvided(state)).toBe(false);
    });
  });
});
