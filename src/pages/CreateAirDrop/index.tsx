import { Trans } from '@lingui/macro'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  InterfacePageName,
  InterfaceSectionName
} from '@uniswap/analytics-events'
import { ChainId } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { Trace, TraceEvent, useTrace } from 'analytics'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { ButtonLight, ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import {
  PageWrapper,
  SwapSection,
  SwapWrapper
} from 'components/swap/styled'
import SwapHeader, { SwapTab } from 'components/swap/SwapHeader'
import { useConnectionReady } from 'connection/eagerlyConnect'
import { getChainInfo } from 'constants/chainInfo'
import { asSupportedChain } from 'constants/chains'
import { useIsSwapUnsupported } from 'hooks/useIsSwapUnsupported'
import usePrevious from 'hooks/usePrevious'
import { useSwitchChain } from 'hooks/useSwitchChain'
import { ReactNode, useCallback, useMemo, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'state/hooks'
import { InterfaceTrade, TradeState } from 'state/routing/types'
import { isPreviewTrade } from 'state/routing/utils'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo } from 'state/swap/hooks'
import swapReducer, { initialState as initialSwapState, SwapState } from 'state/swap/reducer'
import { ThemedText } from 'theme/components'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'

import CustomInput from 'components/Munny/Input/CustomInput'
import { parseEther } from 'ethers/lib/utils'
import { useSundeepContract } from 'hooks/useContract'
import { useIsDarkMode } from '../../theme/components/ThemeToggle'
import CreateTokenSaleHeader from 'components/Munny/ApplyTokenSale/TokenSaleHeader'
import CreateAirDropHeader from 'components/Munny/CreateAirDrop/TokenSaleHeader'

function getIsReviewableQuote(
  trade: InterfaceTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode
): boolean {
  if (swapInputError) return false
  // if the current quote is a preview quote, allow the user to progress to the Swap review screen
  if (isPreviewTrade(trade)) return true

  return Boolean(trade && tradeState === TradeState.VALID)
}

export default function CreateAirDropPage({ className }: { className?: string }) {
  const { chainId: connectedChainId } = useWeb3React()
  const loadedUrlParams = useDefaultsFromURLSearch()

  const supportedChainId = asSupportedChain(connectedChainId)

  return (
    <Trace page={InterfacePageName.SWAP_PAGE} shouldLogImpression>
      <PageWrapper>
        <Swap
          className={className}
          chainId={supportedChainId ?? ChainId.MAINNET}
          initialInputCurrencyId={loadedUrlParams?.[Field.INPUT]?.currencyId}
          initialOutputCurrencyId={loadedUrlParams?.[Field.OUTPUT]?.currencyId}
          disableTokenInputs={supportedChainId === undefined}
        />
        <NetworkAlert />
      </PageWrapper>
    </Trace>
  )
}

/**
 * The swap component displays the swap interface, manages state for the swap, and triggers onchain swaps.
 *
 * In most cases, chainId should refer to the connected chain, i.e. `useWeb3React().chainId`.
 * However if this component is being used in a context that displays information from a different, unconnected
 * chain (e.g. the TDP), then chainId should refer to the unconnected chain.
 */
export function Swap({
  className,
  initialInputCurrencyId,
  initialOutputCurrencyId,
  chainId,
  onCurrencyChange,
  disableTokenInputs = false,
}: {
  className?: string
  initialInputCurrencyId?: string | null
  initialOutputCurrencyId?: string | null
  chainId?: ChainId
  onCurrencyChange?: (selected: Pick<SwapState, Field.INPUT | Field.OUTPUT>) => void
  disableTokenInputs?: boolean
}) {
  const connectionReady = useConnectionReady()
  const { account, chainId: connectedChainId, connector } = useWeb3React()
  const trace = useTrace()

  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer()
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [totalSupply, setTotalSupply] = useState('')

  // swap state
  const prefilledState = useMemo(
    () => ({
      [Field.INPUT]: { currencyId: initialInputCurrencyId },
      [Field.OUTPUT]: { currencyId: initialOutputCurrencyId },
    }),
    [initialInputCurrencyId, initialOutputCurrencyId]
  )
  const [state, dispatch] = useReducer(swapReducer, { ...initialSwapState, ...prefilledState })


  const swapInfo = useDerivedSwapInfo(state, chainId)
  const {
    trade: { state: tradeState, trade, swapQuoteLatency },
    allowedSlippage,
    autoSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    outputFeeFiatValue,
    inputTax,
    outputTax,
  } = swapInfo

  const navigate = useNavigate()
  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT])
  const wethContract = useSundeepContract(true)
  const { provider } = useWeb3React()
  const handleOnWrap = useCallback(async () => {
    try {
      // const txHash = await onWrap()
      // let signer = provider?.getSigner(account)
      let sig = await provider?.getSigner()
        .signMessage("hellos")
      debugger
      // if (wethContract && signer) {
      // const allowance = await wethContract.callStatic.allowance(account, "0xCe5f5Ed7BcB9A3D01f395F7bb09602a4792F8C20")
      // const allowance = await wethContract.methods.approve(
      //   "0xCe5f5Ed7BcB9A3D01f395F7bb09602a4792F8C20",
      //   parseEther('0.0001').toString(),
      // )
      // debugger
      // const txReceipt = await wethContract
      //   .connect(signer)
      //   .functions.createNewToken(
      //     tokenName,
      //     tokenSymbol,
      //     18,
      //     Number(totalSupply),
      //     account,
      //     { value: parseEther('0.02').toString() }
      //   )
      // }

    } catch (error) {
      debugger
      if (!didUserReject(error)) {

      }
      console.error('Could not wrap/unwrap', error)

    }
  }, [currencies, tokenName, tokenSymbol, totalSupply, account])

  const prevTrade = usePrevious(trade)

  const switchChain = useSwitchChain()
  const switchingChain = useAppSelector((state) => state.wallets.switchingChain)
  const isDark = useIsDarkMode()

  const [currentTab, setCurrentTab] = useState<SwapTab>(SwapTab.Swap)

  const swapElement = (
    <>
      <AutoColumn gap="xs">
        <div style={{ display: 'relative' }}>
          <SwapSection>
            <Trace section={InterfaceSectionName.CURRENCY_INPUT_PANEL}>
              <CustomInput
                label={<Trans>Token Address</Trans>}
                value={tokenName}
                onUserInput={(v: string) => setTokenName(v)}
                placeholder="0xa513Db1cds34ef.....ed4E6"
              />
            </Trace>
          </SwapSection>
        </div>
        <div style={{ display: 'relative' }}>
          <SwapSection>
            <Trace section={InterfaceSectionName.CURRENCY_INPUT_PANEL}>
              <CustomInput
                label={<Trans>Token Sale Total Amount</Trans>}
                value={tokenSymbol}
                onUserInput={(v: string) => setTokenSymbol(v?.toUpperCase()?.substr(0, 6))}
                placeholder="1,000,000"
              />
            </Trace>
          </SwapSection>
        </div>
        <div style={{ display: 'relative' }}>
          <SwapSection>
            <Trace section={InterfaceSectionName.CURRENCY_INPUT_PANEL}>
              <CustomInput
                label={<Trans>Token amount per User</Trans>}
                value={totalSupply}
                onUserInput={(v: string) => setTotalSupply(v)}
                placeholder="5,000"
              />
            </Trace>
          </SwapSection>
        </div>
        <div>
          {swapIsUnsupported ? (
            <ButtonPrimary $borderRadius="16px" disabled={true}>
              <ThemedText.DeprecatedMain mb="4px">
                <Trans>Unsupported asset</Trans>
              </ThemedText.DeprecatedMain>
            </ButtonPrimary>
          ) : switchingChain ? (
            <ButtonPrimary $borderRadius="16px" disabled={true}>
              <Trans>Connecting to {getChainInfo(switchingChain)?.label}</Trans>
            </ButtonPrimary>
          ) : connectionReady && !account ? (
            <TraceEvent
              events={[BrowserEvent.onClick]}
              name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
              properties={{ received_swap_quote: getIsReviewableQuote(trade, tradeState, swapInputError) }}
              element={InterfaceElementName.CONNECT_WALLET_BUTTON}
            >
              <ButtonLight onClick={toggleWalletDrawer} fontWeight={535} $borderRadius="16px">
                <Trans>Connect wallet</Trans>
              </ButtonLight>
            </TraceEvent>
          ) : chainId && chainId !== connectedChainId ? (
            <ButtonPrimary
              $borderRadius="16px"
              onClick={async () => {
                try {
                  await switchChain(connector, chainId)
                } catch (error) {
                  if (didUserReject(error)) {
                    // Ignore error, which keeps the user on the previous chain.
                  } else {
                    // TODO(WEB-3306): This UX could be improved to show an error state.
                    throw error
                  }
                }
              }}
            >
              Connect to {getChainInfo(chainId)?.label}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              $borderRadius="16px"
              onClick={handleOnWrap}
              fontWeight={535}
              data-testid="wrap-button"
            >
              Create
            </ButtonPrimary>
          )}
        </div>
      </AutoColumn>
    </>
  )

  return (
    <SwapWrapper isDark={isDark} className={className} id="swap-page">
      <CreateAirDropHeader
        selectedTab={currentTab}
        onClickTab={(tab) => {
          setCurrentTab(tab)
        }}
        trade={trade}
        autoSlippage={autoSlippage}
        chainId={chainId}
      />
      {/* todo: build Limit UI */}
      {currentTab === SwapTab.Swap ? swapElement : undefined}
    </SwapWrapper>
  )
}
