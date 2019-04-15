import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { If, Then, Else, When } from 'react-if';
import { css } from 'emotion';
import {
  fetchClockifyEntitiesInWorkspace,
  fetchClockifyWorkspaces,
  transferEntitiesToClockifyWorkspace,
} from '~/redux/entities/workspaces/workspacesActions';
import {
  selectClockifyIncludedWorkspacesById,
  selectTogglCountsByGroupByWorkspace,
  selectTogglEntitiesByGroupByWorkspace,
  selectTogglIncludedWorkspacesById,
  selectWorkspaceNameBeingFetched,
} from '~/redux/entities/workspaces/workspacesSelectors';
import EntitiesReviewPage from '~/components/entitiesReviewPage/EntitiesReviewPage';
import Loader from '~/components/loader/Loader';
import { StepPageProps } from '~/components/stepPage/StepPage';
import ConfirmationModal from './components/ConfirmationModal';
import { ReduxDispatch, ReduxState, ToolName } from '~/types/commonTypes';
import {
  CountsByGroupByWorkspaceModel,
  EntitiesByGroupByWorkspaceModel,
  CompoundWorkspaceModel,
} from '~/types/workspacesTypes';

interface ConnectStateProps {
  clockifyWorkspacesById: Record<string, CompoundWorkspaceModel>;
  togglCountsByGroupByWorkspace: CountsByGroupByWorkspaceModel;
  togglEntitiesByGroupByWorkspace: EntitiesByGroupByWorkspaceModel;
  togglWorkspacesById: Record<string, CompoundWorkspaceModel>;
  workspaceNameBeingFetched: string;
}

interface ConnectDispatchProps {
  onFetchClockifyEntitiesInWorkspace: (
    workspace: CompoundWorkspaceModel,
  ) => Promise<any>;
  onFetchClockifyWorkspaces: () => Promise<any>;
  onTransferEntitiesToClockifyWorkspace: (
    workspace: CompoundWorkspaceModel,
  ) => Promise<any>;
}

type Props = ConnectStateProps & ConnectDispatchProps & StepPageProps;

export const ReviewClockifyDetailsStepComponent: React.FC<Props> = props => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);

  const fetchClockifyEntitiesInAllWorkspaces = async () => {
    const workspaces = Object.values(props.clockifyWorkspacesById);
    if (workspaces.length === 0) return Promise.resolve();

    for (const workspace of workspaces) {
      await props.onFetchClockifyEntitiesInWorkspace(workspace);
    }
  };

  useEffect(() => {
    props
      .onFetchClockifyWorkspaces()
      .then(fetchClockifyEntitiesInAllWorkspaces)
      .then(() => setIsFetching(false))
      .catch(() => setIsFetching(false));
  }, []);

  const handleNextClick = (): void => {
    setIsModalActive(true);
  };

  const transferAllEntitiesToClockify = async () => {
    setIsTransferring(true);
    const workspaces = Object.values(props.togglWorkspacesById);
    for (const workspace of workspaces) {
      await props.onTransferEntitiesToClockifyWorkspace(workspace);
    }
    setIsTransferring(false);
  };

  const handleModalConfirmClick = () => {
    setIsModalActive(false);
    transferAllEntitiesToClockify()
      .then(() => props.onNextClick())
      .catch(() => props.onNextClick());
  };

  const fetchedName = props.workspaceNameBeingFetched;

  return (
    <If condition={isFetching || isTransferring}>
      <Then>
        <Loader>
          <When condition={isFetching}>
            Fetching Clockify entities, please wait...
          </When>
          <When condition={isTransferring}>
            Transferring entities to Clockify for {fetchedName}, please wait...
          </When>
        </Loader>
      </Then>
      <Else>
        <EntitiesReviewPage
          stepNumber={props.stepNumber}
          subtitle="Review Pending Data Before Transfer"
          toolName={ToolName.Clockify}
          entitiesByGroupByWorkspace={props.togglEntitiesByGroupByWorkspace}
          countsByGroupByWorkspace={props.togglCountsByGroupByWorkspace}
          workspacesById={props.togglWorkspacesById}
          onPreviousClick={props.onPreviousClick}
          onNextClick={handleNextClick}
          instructions={
            <>
              <p
                className={css`
                  margin-bottom: 1rem;
                `}
              >
                This page contains all the records that <strong>will</strong> be
                created on Clockify once you press the <strong>Next </strong>
                button and confirm. If any of the records you selected in the
                previous step already exist on Clockify, you won&apos;t see them
                here...because they already exist...uh...on Clockify.
              </p>
              <p>
                If you see something here that you <strong>don&apos;t </strong>
                want transferred, press the <strong>Previous</strong> button to
                go back and uncheck it.
              </p>
            </>
          }
        />
        <ConfirmationModal
          isActive={isModalActive}
          onConfirmClick={handleModalConfirmClick}
          onCancelClick={() => setIsModalActive(false)}
        />
      </Else>
    </If>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  clockifyWorkspacesById: selectClockifyIncludedWorkspacesById(state),
  togglEntitiesByGroupByWorkspace: selectTogglEntitiesByGroupByWorkspace(state),
  togglCountsByGroupByWorkspace: selectTogglCountsByGroupByWorkspace(state),
  togglWorkspacesById: selectTogglIncludedWorkspacesById(state),
  workspaceNameBeingFetched: selectWorkspaceNameBeingFetched(state),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onFetchClockifyEntitiesInWorkspace: (workspace: CompoundWorkspaceModel) =>
    dispatch(fetchClockifyEntitiesInWorkspace(workspace)),
  onFetchClockifyWorkspaces: () => dispatch(fetchClockifyWorkspaces()),
  onTransferEntitiesToClockifyWorkspace: (workspace: CompoundWorkspaceModel) =>
    dispatch(transferEntitiesToClockifyWorkspace(workspace)),
});

export default connect<ConnectStateProps, ConnectDispatchProps, StepPageProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewClockifyDetailsStepComponent);
