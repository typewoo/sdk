import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });
/**
 * Integration: Admin Shipping Zones
 * Covers list/get/create/update/delete zones; list/update locations; list/get/add/update/delete methods.
 */
describe('Integration: Admin Shipping Zones', () => {
  beforeAll(async () => {
    await Typewoo.init({
      baseUrl: GET_WP_URL(),
      admin: {
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists shipping zones and can CRUD a zone', async () => {
    const list = await Typewoo.admin.shippingZones.list({ context: 'view' });
    if (list.error) {
      expect(list.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i,
      );
    } else {
      expect(Array.isArray(list.data)).toBe(true);
    }

    const created = await Typewoo.admin.shippingZones.create({
      name: `INT-ZONE-${Date.now()}`,
      order: 9999,
    });
    if (created.error) {
      expect(created.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i,
      );
      return; // environment may block writes
    }
    expect(created.data).toBeTruthy();
    if (!created.data) return;
    const zoneId = created.data.id;

    try {
      const get = await Typewoo.admin.shippingZones.get(zoneId, {
        context: 'view',
      });
      expect(get.error).toBeFalsy();
      expect(get.data?.id).toBe(zoneId);

      const upd = await Typewoo.admin.shippingZones.update(zoneId, {
        name: `${created.data.name}-UPD`,
      });
      expect(upd.error).toBeFalsy();

      const del = await Typewoo.admin.shippingZones.delete(zoneId, true);
      expect(del.error).toBeFalsy();
    } finally {
      await Typewoo.admin.shippingZones.delete(zoneId, true);
    }
  });

  it('manages zone locations and methods', async () => {
    // Create a zone to attach locations/methods
    const created = await Typewoo.admin.shippingZones.create({
      name: `INT-ZONE-M-${Date.now()}`,
    });
    if (created.error || !created.data) {
      if (created.error) {
        expect(created.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i,
        );
      }
      return;
    }
    const zoneId = created.data.id;

    try {
      // Locations: list then attempt a no-op update
      const locList = await Typewoo.admin.shippingZones.listLocations(zoneId);
      if (locList.error) {
        expect(locList.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i,
        );
      } else {
        const update = await Typewoo.admin.shippingZones.updateLocations(
          zoneId,
          locList.data ?? [],
        );
        if (update.error) {
          expect(update.error.code).toMatch(
            /not_found|invalid|forbidden|unsupported/i,
          );
        } else {
          expect(Array.isArray(update.data)).toBe(true);
        }
      }

      // Methods: list existing
      const methods = await Typewoo.admin.shippingZones.listMethods(zoneId, {
        context: 'view',
      });
      if (methods.error) {
        expect(methods.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i,
        );
      } else {
        expect(Array.isArray(methods.data)).toBe(true);
      }

      // Try to add a common method (flat_rate) if possible
      const added = await Typewoo.admin.shippingZones.addMethod(
        zoneId,
        'flat_rate',
        {
          enabled: false,
        },
      );
      if (added.error) {
        expect(added.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i,
        );
        return; // can't proceed without a method instance
      }
      expect(added.data).toBeTruthy();
      if (!added.data) return;
      const instanceId = added.data.instance_id;

      // Get method
      const getM = await Typewoo.admin.shippingZones.getMethod(
        zoneId,
        instanceId,
      );
      expect(getM.error).toBeFalsy();
      expect(getM.data?.instance_id).toBe(instanceId);

      // Update method: toggle enabled or no-op settings
      const payload = { enabled: !(getM.data?.enabled ?? false) };
      const updM = await Typewoo.admin.shippingZones.updateMethod(
        zoneId,
        instanceId,
        payload,
      );
      if (updM.error) {
        expect(updM.error.code).toMatch(
          /not_found|invalid|forbidden|unsupported/i,
        );
      } else {
        expect(updM.data?.instance_id).toBe(instanceId);
      }

      // Delete method
      const delM = await Typewoo.admin.shippingZones.deleteMethod(
        zoneId,
        instanceId,
        true,
      );
      expect(delM.error).toBeFalsy();
    } finally {
      await Typewoo.admin.shippingZones.delete(zoneId, true);
    }
  });
});
