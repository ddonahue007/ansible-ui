import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useBulkActionDialog } from '../../../../../framework';
import { usePostRequest } from '../../../../common/crud/usePostRequest';
import { User } from '../../../interfaces/User';
import { ResourceType } from '../../common/ResourceAccessList';

export function useAddUsersToResources() {
  const { t } = useTranslation();
  const userProgressDialog = useBulkActionDialog<User>();
  const postRequest = usePostRequest();
  const addUserToTeams = useCallback(
    (users: User[], resources: ResourceType[], onComplete?: (users: User[]) => void) => {
      userProgressDialog({
        title: t('Adding users', { count: resources.length }),
        keyFn: (user: User) => user.id,
        items: users,
        actionColumns: [{ header: 'User', cell: (user: User) => user.username }],
        actionFn: async (user: User, signal: AbortSignal) => {
          for (const resource of resources) {
            await postRequest(
              `/api/v2/users/${user.id.toString()}/roles/`,
              { id: resource.summary_fields.object_roles.member_role.id },
              signal
            );
          }
        },
        processingText: t('Adding users...', { count: resources.length }),
        onComplete,
      });
    },
    [userProgressDialog, t, postRequest]
  );
  return addUserToTeams;
}
