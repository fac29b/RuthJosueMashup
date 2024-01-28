



import { expect } from 'chai';
import supertest from 'supertest';
import { describe, it } from 'mocha';

import { app, findLocation, weather, getOpenAIResponse } from '../server.js';


const request = supertest(app);

describe('Weather and Location App', function () {
  this.timeout(10000); // Set a longer timeout

  describe('GET /', () => {
    it('should return location, weatherData, and openaiResponse', async () => {
      const response = await request.get('/');

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('location');
      expect(response.body).to.have.property('weatherData');
      expect(response.body).to.have.property('openaiResponse');
    });
  });

  describe('findLocation function', () => {
    it('should return location information for provided latitude and longitude', async () => {
      const latitude = 51.47700119018555;
      const longitude = -0.19589999318122864;
  
      const location = await findLocation(latitude, longitude);
      console.log('Location:', location);
  
      expect(location).to.have.property('ipAddress');
      expect(location).to.have.property('addressCountryCode');
      expect(location).to.have.property('addressCountry');
      expect(location).to.have.property('addressRegion');
      expect(location).to.have.property('addressLocality');
      expect(location).to.have.property('postalCode');
      expect(location).to.have.property('timeZone');
      expect(location).to.have.property('latitude');
      expect(location).to.have.property('longitude');
    });
  
    it('should return default location information if latitude and longitude are not provided', async () => {
      const location = await findLocation();
  
      expect(location).to.have.property('ipAddress');
      expect(location).to.have.property('country_name');
      expect(location).to.have.property('state_prov');
      expect(location).to.have.property('city');
      expect(location).to.have.property('latitude');
      expect(location).to.have.property('longitude');
    });
  });
  
});