import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { useLimitsEnabled } from 'featureFlags/flags/limits'
import { InterfaceTrade } from 'state/routing/types'
import styled from 'styled-components'
import { ButtonText } from 'theme/components'

import { RowBetween, RowFixed } from '../../Row'
import SettingsTab from '../../Settings'

const StyledSwapHeader = styled(RowBetween)`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.neutral2};
`

const HeaderButtonContainer = styled(RowFixed)`
  padding: 0 12px;
  gap: 16px;
`

const StyledTextButton = styled(ButtonText)<{ $isActive: boolean }>`
  color: ${({ theme, $isActive }) => ($isActive ? theme.neutral1 : theme.neutral2)};
  gap: 4px;
  font-weight: 485;
  &:focus {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
`

export enum SwapTab {
  Swap = 'swap',
  Limit = 'limit',
}

export default function CreateTokenSaleHeader({
  autoSlippage,
  chainId,
  trade,
  selectedTab,
  onClickTab,
}: {
  autoSlippage: Percent
  chainId?: number
  trade?: InterfaceTrade
  selectedTab: SwapTab
  onClickTab: (tab: SwapTab) => void
}) {
  const limitsEnabled = useLimitsEnabled()
  return (
    <StyledSwapHeader>
      <HeaderButtonContainer>
        <StyledTextButton $isActive={selectedTab === SwapTab.Swap} onClick={() => onClickTab?.(SwapTab.Swap)}>
          <Trans>Create Token Sale</Trans>
        </StyledTextButton>
        {/* <SwapBuyFiatButton /> */}
        {/* {limitsEnabled && (
          <StyledTextButton $isActive={selectedTab === SwapTab.Limit} onClick={() => onClickTab?.(SwapTab.Limit)}>
            <Trans>Limit</Trans>
          </StyledTextButton>
        )} */}
      </HeaderButtonContainer>
      <RowFixed>
        <SettingsTab autoSlippage={autoSlippage} chainId={chainId} trade={trade} />
      </RowFixed>
    </StyledSwapHeader>
  )
}
